import { useState, useEffect, useContext, useRef } from 'react';
import { fabric } from 'fabric';
import styled from 'styled-components/macro';
import AuthContext from '../../context/authContext';
import {
  storage,
  setNewBoard,
  saveBoard,
  getBoard,
  // uploadTemplate,
  getTemplate,
} from '../../utils/firebase';
import {
  ref,
  listAll,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  // uploadString,
} from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

import { TfiText, TfiSaveAlt } from 'react-icons/tfi';
import { CiCircleInfo, CiTrash, CiUndo } from 'react-icons/ci';
// import { CiCircleInfo, CiTrash, CiUndo, CiSaveDown2 } from 'react-icons/ci';

import Button from '../../components/Button/Button';

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

  & > .info {
    color: #fff;
    stroke-width: 0.25px;
  }
`;

const Remind = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #fff;
`;

const ImageWrapper = styled.div`
  display: grid;
  width: 100%;
  height: calc(100% - 80px);
  padding-top: 10px;
  grid-template-rows: repeat(auto-fit, minmax(100px, auto));
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-auto-rows: 100px;
  align-content: start;
  grid-gap: 10px;
  overflow-y: scroll;
`;

const Image = styled.img`
  max-width: 100%;
  aspect-ratio: attr(width) / attr(height);
  object-fit: cover;
`;

const VisionBoardContainer = styled.div`
  display: flex;
  width: 70%;
  height: 100%;
  padding: 20px;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #8d9ca4;
  gap: 20px;
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
  gap: 5px;
`;

const ToolName = styled.label`
  font-size: 0.75rem;
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
  align-items: center;
  gap: 20px;

  & > .text {
    width: 20px;
    height: 20px;
    color: #fff;

    &:hover {
      cursor: pointer;
      stroke-width: 0.5px;
    }
  }

  & > .trash,
  .undo {
    width: 25px;
    height: 25px;
    color: #fff;

    &:hover {
      cursor: pointer;
      stroke-width: 0.5px;
    }
  }

  & .save {
    width: 20px;
    height: 20px;
    color: #fff;

    &:hover {
      cursor: pointer;
      stroke-width: 0.5px;
    }
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
  const navigate = useNavigate();

  const [images, setImages] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [visionBoard, setVisionBoard] = useState(null);
  const [bgColor, setBgColor] = useState('#F4F3EF');
  const [textConfig, setTextConfig] = useState({
    color: '#000',
    fontSize: 16,
  });
  const [activeItem, setActiveItem] = useState(null);

  const canvasRef = useRef(null);
  const boardIdRef = useRef(null);
  const storageRef = ref(storage, `/${uid}/images/`);

  const LAYOUT_1_ID = 'eDuLEGPS3NCJsyeIYzXl';

  // async function loadPrevBoard() {
  //   const prevData = await getBoard(uid, boardIdRef.current);
  //   console.log(prevData);
  //   visionBoard.loadFromJSON(prevData.data);
  // }

  useEffect(() => {
    async function renderBoard() {
      if (canvasRef.current) {
        const { template } = await getTemplate(LAYOUT_1_ID);

        // console.log(templateData);

        const canvas = new fabric.Canvas('canvas', {
          width: 625,
          height: 475,
          backgroundColor: bgColor,
        });

        // setLayout(canvas);
        canvas.loadFromJSON(template);
        setVisionBoard(canvas);
        setActiveItem(canvas.getActiveObject());
      }
    }

    renderBoard();
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

    async function createBoard() {
      const id = localStorage.getItem('boardId');
      if (id) {
        boardIdRef.current = id;

        // await saveBoard(uid, id, visionBoard.toJSON(['isClipFrame']), false);

        const prevData = await getBoard(uid, id);
        visionBoard.loadFromJSON(prevData.data);
      } else {
        const boardId = await setNewBoard(uid, JSON.stringify(visionBoard));
        localStorage.setItem('boardId', boardId);
        boardIdRef.current = boardId;

        await saveBoard(
          uid,
          boardId,
          visionBoard.toJSON(['isClipFrame']),
          false
        );
      }
    }
    createBoard();

    function findActiveObject() {
      const activeObject = visionBoard.getActiveObject();
      setActiveItem(activeObject);

      if (activeObject && activeObject.type === 'i-text') {
        setTextConfig({
          color: activeObject.fill,
          fontSize: activeObject.fontSize,
        });
      }
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

  function deleteActiveItem() {
    if (!activeItem || !visionBoard) return;

    //!刪除template文字需要按兩次
    visionBoard.remove(activeItem);
    visionBoard.renderAll();
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
    setActiveItem(newText);
  }

  async function clear() {
    visionBoard.clear();
    // setLayout(visionBoard);

    const { template } = await getTemplate(LAYOUT_1_ID);
    visionBoard.loadFromJSON(template);
    // visionBoard.setBackgroundColor('#F4F3EF', () => {
    //   visionBoard.renderAll();
    // });
  }

  async function saveProject() {
    // const dataURL = visionBoard.toDataURL('image/png', 1);
    // const imageRef = ref(storageRef, `${boardIdRef.current}`);

    // const snapshot = await uploadString(imageRef, dataURL, 'data_url');
    // const newURL = await getDownloadURL(snapshot.ref);

    // await uploadTemplate(visionBoard.toJSON(['isClipFrame']));

    await saveBoard(
      uid,
      boardIdRef.current,
      // JSON.stringify(visionBoard),
      visionBoard.toJSON(['isClipFrame']),
      true
    );

    navigate(`/profile`);
  }

  // function setLayout(canvas) {
  //   const clipPathTopL = new fabric.Rect({
  //     width: 130,
  //     height: 90,
  //     left: 120,
  //     top: 53,
  //     fill: 'rgba(141, 156, 164, 0.5)',
  //     selectable: false,
  //     isClipFrame: true,
  //   });

  //   const clipPathTopR = new fabric.Rect({
  //     width: 195,
  //     height: 90,
  //     left: 256,
  //     top: 53,
  //     fill: 'rgba(141, 156, 164, 0.5)',
  //     selectable: false,
  //     isClipFrame: true,
  //   });

  //   const clipPathMiddleL = new fabric.Rect({
  //     width: 130,
  //     height: 190,
  //     left: 120,
  //     top: 149,
  //     fill: 'rgba(141, 156, 164, 0.5)',
  //     selectable: false,
  //     isClipFrame: true,
  //   });

  //   const clipPathMiddleR = new fabric.Rect({
  //     width: 250,
  //     height: 150,
  //     left: 256,
  //     top: 149,
  //     fill: 'rgba(141, 156, 164, 0.5)',
  //     selectable: false,
  //     isClipFrame: true,
  //   });

  //   const clipPathBottom = new fabric.Rect({
  //     width: 77,
  //     height: 77,
  //     left: 173,
  //     top: 345,
  //     fill: 'rgba(141, 156, 164, 0.5)',
  //     selectable: false,
  //     isClipFrame: true,
  //   });

  //   const textArea = new fabric.IText('Enter Your Goal...', {
  //     width: 250,
  //     height: 117,
  //     left: 266,
  //     top: 315,
  //     padding: 10,
  //     fill: '#8D9CA4',
  //     charSpacing: 20,
  //     lineHeight: 1.25,
  //     fontFamily: 'TT Norms Pro',
  //     fontSize: textConfig.fontSize,
  //     selectable: true,
  //     hasControls: false,
  //     lockMovementX: true,
  //     lockMovementY: true,
  //     lockScalingX: true,
  //     lockScalingY: true,
  //   });

  //   const period = new fabric.IText('/2023', {
  //     left: 556,
  //     top: 18,
  //     fill: '#8D9CA4',
  //     charSpacing: 20,
  //     lineHeight: 1.25,
  //     fontFamily: 'TT Norms Pro',
  //     fontSize: textConfig.fontSize,
  //     selectable: true,
  //     hasControls: false,
  //     lockMovementY: true,
  //     lockScalingX: true,
  //     lockScalingY: true,
  //   });

  //   const boardText = new fabric.Text('VISION\nBOARD', {
  //     left: 18,
  //     top: 423,
  //     fill: '#8D9CA4',
  //     charSpacing: 20,
  //     lineHeight: 1.25,
  //     textAlign: 'left',
  //     fontFamily: 'TT Norms Pro',
  //     fontSize: 16,
  //     selectable: false,
  //   });

  //   const visionText = new fabric.Text('Vision\nPictures', {
  //     left: 60,
  //     top: 53,
  //     fill: '#D9CCC1',
  //     fontFamily: 'TT Norms Pro',
  //     textAlign: 'right',
  //     charSpacing: 20,
  //     fontSize: 14,
  //     selectable: false,
  //   });

  //   canvas.add(
  //     clipPathTopL,
  //     clipPathTopR,
  //     clipPathMiddleL,
  //     clipPathMiddleR,
  //     clipPathBottom,
  //     textArea,
  //     visionText,
  //     period,
  //     boardText
  //   );

  //   canvas.add(textArea).setActiveObject(textArea);
  // }

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
            <CiCircleInfo className="info" />
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
                <ToolName>背景</ToolName>
                <ColorSelector
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </ToolBar>
            </ToolWrapper>
            {activeItem && activeItem.type === 'i-text' && (
              <>
                <ToolWrapper>
                  <ToolBar>
                    <ToolName>文字</ToolName>
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
                    <ToolName>字體大小</ToolName>
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
              </>
            )}

            <ActionWrapper>
              {activeItem && (
                <CiTrash className="trash" onClick={deleteActiveItem} />
              )}
              <TfiText className="text" onClick={addText} />
              <CiUndo className="undo" onClick={clear} />
              {/* <CiSaveDown2 className="save" onClick={saveProject} /> */}
              <TfiSaveAlt className="save" onClick={saveProject} />
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
