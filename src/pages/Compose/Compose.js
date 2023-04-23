import { useState, useEffect, useContext, useRef } from 'react';
import { fabric } from 'fabric';
import styled from 'styled-components/macro';
import AuthContext from '../../context/authContext';
import {
  storage,
  getTemplate,
  setNewBoard,
  saveBoard,
} from '../../utils/firebase';
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
  margin-left: 250px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
  color: #000;
`;

const BoardContainer = styled.div`
  display: flex;
  width: 80%;
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
  background-color: #000;
`;

export default function Compose() {
  const { uid } = useContext(AuthContext);

  const [images, setImages] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  // const [activeObject, setActiveObject] = useState(null);

  const [savedRecord, setSavedRecord] = useState(null);
  const [visionBoard, setVisionBoard] = useState(null);
  const [bgColor, setBgColor] = useState('#fbfbf9');
  const [textConfig, setTextConfig] = useState({
    color: '#000',
    fontSize: 16,
  });

  const canvasRef = useRef(null);
  const boardIdRef = useRef(null);

  const storageRef = ref(storage, `/${uid}/images/`);

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
              <ActionIconL src={text} />
              <ActionIconM src={save} />
              <ActionIconM src={undo} />
            </ActionWrapper>
          </SettingWrapper>
          <VisionBoard />
        </VisionBoardContainer>
      </BoardContainer>
      <Background />
    </Container>
  );
}
