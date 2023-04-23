import { useState, useEffect, useContext, useRef } from 'react';
import { fabric } from 'fabric';
import styled from 'styled-components/macro';
import AuthContext from '../../context/authContext';
import { storage, setNewBoard, saveBoard } from '../../utils/firebase';
import {
  ref,
  listAll,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  uploadString,
} from 'firebase/storage';

import Button from '../../components/Button/Button';

import info from './info.png';
import text from './text.png';
import save from './save.png';
import undo from './undo.png';

const Container = styled.div`
  margin: 0 auto;
  padding: 0 150px;
`;

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 500px;
  background-color: #f4f3ef;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
  color: #000;
`;

const BoardContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 198px);
  margin: 0 auto;
  padding-top: 30px;
  gap: 30px;
`;

const UploadContainer = styled.div`
  width: 30%;
  height: 100%;
  padding: 20px;
  background-color: rgba(141, 156, 164, 0.5);
`;

const RemindWrapper = styled.div`
  display: flex;
  height: 30px;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const InfoIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const Remind = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #fff;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 80px);
  flex-wrap: wrap;
  overflow-y: scroll;
  gap: 10px;
`;

const Image = styled.img`
  height: 100px;
`;

const VisionBoardContainer = styled.div`
  display: flex;
  width: 70%;
  height: 100%;
  padding: 20px;
  flex-direction: column;
  justify-content: space-between;
  background-color: #8d9ca4;
`;

const SettingWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

const ToolWrapper = styled.div`
  display: flex;
`;

const ToolBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ToolName = styled.label`
  letter-spacing: 0.1rem;
  color: #fff;
`;

const ColorSelector = styled.input`
  width: 20px;
  height: 20px;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 1px solid #fff;
  }

  &:hover {
    cursor: pointer;
  }
`;

const FontSizeRange = styled.input`
  -webkit-appearance: none;
  height: 5px;
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.2);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
  }
`;

const FontSize = styled.span`
  letter-spacing: 0.1rem;
  color: #fff;
`;

const ActionWrapper = styled.div`
  display: flex;
  margin-left: auto;
  gap: 20px;
`;

const ActionIconL = styled.img`
  width: 30px;
  height: 30px;

  &:hover {
    cursor: pointer;
  }
`;

const ActionIconM = styled.img`
  width: 22px;
  height: 22px;

  &:hover {
    cursor: pointer;
  }
`;

const VisionBoard = styled.div`
  width: 625px;
  height: 475px;
  margin: 0 auto;
  box-shadow: 0px 4px 90px 10px rgba(0, 0, 0, 0.1);
`;

export default function Compose() {
  const { uid } = useContext(AuthContext);

  const [images, setImages] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [visionBoard, setVisionBoard] = useState(null);
  const [bgColor, setBgColor] = useState('#F4F3EF');
  const [textConfig, setTextConfig] = useState({
    color: '#000',
    fontSize: 16,
  });

  const canvasRef = useRef(null);
  const boardIdRef = useRef(null);

  const storageRef = ref(storage, `/${uid}/images/`);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas('canvas', {
        width: 625,
        height: 475,
        backgroundColor: bgColor,
      });

      setLayout(canvas);
      setVisionBoard(canvas);
      // setSavedRecord(JSON.stringify(canvas));
    }
  }, [canvasRef]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await listAll(storageRef);
        const data = await Promise.all(
          res.items.map((itemRef) => getMetadata(itemRef))
        );

        const urls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef))
        );

        const newData = urls.reduce((acc, curr, index) => {
          acc[index].url = curr;
          return acc;
        }, data);

        newData.sort((a, b) => new Date(b.updated) - new Date(a.updated));

        const newUrls = newData.map((data) => data.url);
        setImages(newUrls);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, [uid, isUploaded]);

  useEffect(() => {
    if (!uid || !visionBoard) return;

    //確認是否有建立過
    async function createBoard() {
      const id = localStorage.getItem('boardId');
      if (id) {
        boardIdRef.current = id;
      } else {
        const boardId = await setNewBoard(uid, JSON.stringify(visionBoard));
        localStorage.setItem('boardId', boardId);
        boardIdRef.current = boardId;
      }
    }
    createBoard();

    function findActiveObject() {
      const activeObject = visionBoard.getActiveObject();

      if (activeObject && activeObject.type === 'i-text')
        setTextConfig({
          color: activeObject.fill,
          fontSize: activeObject.fontSize,
        });
    }
    visionBoard.on('mouse:down', findActiveObject);

    return () => visionBoard.off('mouse:down', findActiveObject);
  }, [uid, visionBoard]);

  useEffect(() => {
    if (!visionBoard) return;

    visionBoard.setBackgroundColor(bgColor, () => {
      visionBoard.renderAll();
    });

    const activeObject = visionBoard.getActiveObject();

    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set({
        fill: textConfig.color,
        fontSize: textConfig.fontSize,
      });
      visionBoard.renderAll();
    }
  }, [visionBoard, bgColor, textConfig]);

  useEffect(() => {
    if (!visionBoard || draggingIndex === null || images === null) return;

    function dropImage(e) {
      const target = e.target;
      let clipPath;

      if (!target.isClipFrame) return;

      target.clipPath = null;
      target.clone((cloned) => (clipPath = cloned));
      clipPath.absolutePositioned = true;

      const movingImage = images[draggingIndex];

      fabric.Image.fromURL(
        movingImage,
        (img) => {
          const image = img.set({
            left: target.left,
            top: target.top,
            clipPath,
          });

          image.scaleToWidth(target.getScaledWidth());
          const isFullHeight = image.getScaledHeight() < target.height;
          if (isFullHeight) image.scaleToHeight(target.getScaledHeight());
          image.lockMovementY = isFullHeight;
          image.lockMovementX = !isFullHeight;

          image.clipPath = clipPath;

          visionBoard.add(image);
        },
        { crossOrigin: 'anonymous' }
      );
    }

    visionBoard.on('drop', dropImage);

    return () => visionBoard.off('drop', dropImage);
  }, [visionBoard, draggingIndex]);

  function handleFileUpload(e) {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storageRef, `${file.name}`);

      uploadBytes(imageRef, file).then(() => setIsUploaded(!isUploaded));
    }
    return null;
  }

  function handleSelectImage() {
    const uploadImage = document.getElementById('uploadImage');
    if (uploadImage) {
      uploadImage.click();
    }
  }

  function addText() {
    const newText = new fabric.IText('Enter Here...', {
      top: 10,
      left: 10,
      fill: textConfig.color,
      charSpacing: 20,
      lineHeight: 1.25,
      fontFamily: 'TT Norms Pro',
      fontSize: textConfig.fontSize,
      selectable: true,
      hasControls: false,
    });
    visionBoard.add(newText).setActiveObject(newText);
  }

  function clear() {
    visionBoard.clear();
    setLayout(visionBoard);
    visionBoard.setBackgroundColor('#F4F3EF', () => {
      visionBoard.renderAll();
    });
  }

  async function saveProject() {
    const dataURL = visionBoard.toDataURL('image/png', 1);
    const imageRef = ref(storageRef, `${boardIdRef.current}`);

    const snapshot = await uploadString(imageRef, dataURL, 'data_url');
    const newURL = await getDownloadURL(snapshot.ref);

    await saveBoard(
      uid,
      boardIdRef.current,
      JSON.stringify(visionBoard),
      newURL
    );
  }

  function setLayout(canvas) {
    const clipPathTopL = new fabric.Rect({
      width: 130,
      height: 90,
      left: 120,
      top: 53,
      fill: 'rgba(141, 156, 164, 0.5)',
      selectable: false,
      isClipFrame: true,
    });

    const clipPathTopR = new fabric.Rect({
      width: 195,
      height: 90,
      left: 256,
      top: 53,
      fill: 'rgba(141, 156, 164, 0.5)',
      selectable: false,
      isClipFrame: true,
    });

    const clipPathMiddleL = new fabric.Rect({
      width: 130,
      height: 190,
      left: 120,
      top: 149,
      fill: 'rgba(141, 156, 164, 0.5)',
      selectable: false,
      isClipFrame: true,
    });

    const clipPathMiddleR = new fabric.Rect({
      width: 250,
      height: 150,
      left: 256,
      top: 149,
      fill: 'rgba(141, 156, 164, 0.5)',
      selectable: false,
      isClipFrame: true,
    });

    const clipPathBottom = new fabric.Rect({
      width: 77,
      height: 77,
      left: 173,
      top: 345,
      fill: 'rgba(141, 156, 164, 0.5)',
      selectable: false,
      isClipFrame: true,
    });

    const textArea = new fabric.IText('Enter Your Goal...', {
      width: 250,
      height: 117,
      left: 266,
      top: 315,
      padding: 10,
      fill: '#8D9CA4',
      charSpacing: 20,
      lineHeight: 1.25,
      fontFamily: 'TT Norms Pro',
      fontSize: textConfig.fontSize,
      selectable: true,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
    });

    const period = new fabric.IText('/2023', {
      left: 556,
      top: 18,
      fill: '#8D9CA4',
      charSpacing: 20,
      lineHeight: 1.25,
      fontFamily: 'TT Norms Pro',
      fontSize: textConfig.fontSize,
      selectable: true,
      hasControls: false,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
    });

    const boardText = new fabric.IText('VISION\nBOARD', {
      left: 18,
      top: 423,
      fill: '#8D9CA4',
      charSpacing: 20,
      lineHeight: 1.25,
      fontFamily: 'TT Norms Pro',
      fontSize: textConfig.fontSize,
      selectable: true,
      hasControls: false,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
    });

    const visionText = new fabric.Text('Vision\nPictures', {
      left: 60,
      top: 53,
      fill: '#D9CCC1',
      fontFamily: 'TT Norms Pro',
      textAlign: 'right',
      charSpacing: 20,
      fontSize: 14,
    });

    canvas.add(
      clipPathTopL,
      clipPathTopR,
      clipPathMiddleL,
      clipPathMiddleR,
      clipPathBottom,
      textArea,
      visionText,
      period,
      boardText
    );

    canvas.add(textArea).setActiveObject(textArea);
  }

  return (
    <Container>
      <PageTitle>VISION BOARD</PageTitle>

      <BoardContainer>
        <UploadContainer>
          <input
            id="uploadImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e)}
            multiple
            style={{ display: 'none' }}
          />
          <label htmlFor="uploadImage">
            <Button
              width="100%"
              buttonType="normal"
              onClick={handleSelectImage}
            >
              選擇照片
            </Button>
          </label>
          <RemindWrapper>
            <InfoIcon src={info} />
            <Remind>請拖拉照片至格子調整</Remind>
          </RemindWrapper>
          <ImageWrapper>
            {images &&
              images.map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  draggable
                  onDragStart={() => setDraggingIndex(index)}
                  onDragEnd={() => setDraggingIndex(null)}
                />
              ))}
          </ImageWrapper>
        </UploadContainer>

        <VisionBoardContainer>
          <SettingWrapper>
            <ToolWrapper>
              <ToolBar>
                <ToolName>Background</ToolName>
                <ColorSelector
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </ToolBar>
            </ToolWrapper>
            <ToolWrapper>
              <ToolBar>
                <ToolName>Text</ToolName>
                <ColorSelector
                  type="color"
                  value={textConfig.color}
                  onChange={(e) =>
                    setTextConfig({ ...textConfig, color: e.target.value })
                  }
                />
              </ToolBar>
            </ToolWrapper>
            <ToolWrapper>
              <ToolBar>
                <ToolName>Font-Size</ToolName>
                <FontSizeRange
                  type="range"
                  min="10"
                  max="40"
                  defaultValue="16"
                  value={textConfig.fontSize}
                  onChange={(e) =>
                    setTextConfig({
                      ...textConfig,
                      fontSize: Number(e.target.value),
                    })
                  }
                />
                <FontSize>{textConfig.fontSize}</FontSize>
              </ToolBar>
            </ToolWrapper>

            <ActionWrapper>
              <ActionIconL src={text} onClick={addText} />
              <ActionIconM src={undo} onClick={clear} />
              <ActionIconM src={save} onClick={saveProject} />
            </ActionWrapper>
          </SettingWrapper>

          <VisionBoard ref={canvasRef}>
            <canvas id="canvas" />
          </VisionBoard>
        </VisionBoardContainer>
      </BoardContainer>
      <Background />
    </Container>
  );
}
