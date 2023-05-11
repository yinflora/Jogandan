import { fabric } from 'fabric';
import { getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components/macro';
import Alert from '../../components/Alert/Alert';
import AuthContext from '../../context/authContext';
import { getTemplate, saveBoard, storage } from '../../utils/firebase';
import ImageUpload from './ImageUpload';
import VisionBoard from './VisionBoard';

const Container = styled.div`
  min-width: 1280px;
  max-width: 1440px;
  margin: 110px auto 0;
  padding: 0 150px;
  cursor: default;
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

const blink = keyframes`
  0% {
    opacity: .2;
  }
  20% {
    opacity: 1;
  }

  100% {
    opacity: .2;
  }
`;

const SavePrompt = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 65px;
  height: 20px;
  font-size: 1rem;
  display: flex;
  align-items: end;
`;

const SavingDot = styled.div`
  font-size: 1.5rem;
  animation: ${blink} 1.4s linear infinite both;
`;

const SecondSavingDot = styled(SavingDot)`
  animation-delay: 0.2s;
`;

const ThirdSavingDot = styled(SavingDot)`
  animation-delay: 0.4s;
`;

const BoardContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: calc(100vh - 173px);
  max-height: 650px;
  margin: 0 auto;
  padding-top: 30px;
  gap: 30px;
`;

function useVisionBoard(user, images, draggingIndex) {
  const [visionBoard, setVisionBoard] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [bgColor, setBgColor] = useState('#F4F3EF');
  const [textConfig, setTextConfig] = useState({
    color: '#000',
    fontSize: 16,
  });
  const [isSaving, setIsSaving] = useState(false);

  async function saveProject() {
    setIsSaving(true);

    const visionBoardData = visionBoard.toJSON([
      'isClipFrame',
      'selectable',
      'hasControls',
      'hoverCursor',
    ]);

    await saveBoard(visionBoardData, true);

    setTimeout(() => setIsSaving(false), 1000);
  }

  useEffect(() => {
    if (!user) return;
    async function setBoard() {
      try {
        const canvas = new fabric.Canvas('canvas', {
          width: 625,
          height: 475,
          backgroundColor: bgColor,
        });

        const { data } = user.visionBoard;
        canvas.loadFromJSON(data);

        setVisionBoard(canvas);
        setBgColor(data.background);
      } catch (error) {
        console.error(error);
      }
    }
    setBoard();
  }, [user]);

  useEffect(() => {
    if (!visionBoard) return;

    function setActiveObject() {
      const activeObject = visionBoard.getActiveObject();
      setActiveItem(activeObject);

      if (activeObject && activeObject.type === 'i-text') {
        setTextConfig({
          color: activeObject.fill,
          fontSize: activeObject.fontSize,
        });
      }
    }

    function dropImage(e) {
      if (draggingIndex === null || images.length === 0) return;

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

      saveProject();
    }

    visionBoard.on('mouse:down', setActiveObject);
    visionBoard.on('drop', dropImage);

    return () => {
      visionBoard.off('mouse:down', setActiveObject);
      visionBoard.off('drop', dropImage);
    };
  }, [visionBoard, draggingIndex]);

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

    saveProject();
  }, [visionBoard, bgColor, textConfig, activeItem]);

  return {
    visionBoard,
    setVisionBoard,
    activeItem,
    setActiveItem,
    bgColor,
    setBgColor,
    textConfig,
    setTextConfig,
    isSaving,
    setIsSaving,
    saveProject,
  };
}

function useImages(user) {
  const [images, setImages] = useState([]);
  const [isBottom, setIsBottom] = useState(false);

  const imageContainerRef = useRef(null);
  const startIndexRef = useRef(null);
  const imagesRef = useRef(null);

  const storageRef = ref(storage, `/${user.uid}/images/`);
  const MAX_IMAGES = 14;

  useEffect(() => {
    if (!user) return;
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
        imagesRef.current = newUrls;

        const startIndex = startIndexRef.current;
        const endIndex = startIndexRef.current + MAX_IMAGES;

        const slicedItems = newUrls.slice(startIndex, endIndex);
        const newImages = [...images, ...slicedItems];

        setImages(newImages);

        startIndexRef.current = endIndex;
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, [user]);

  useEffect(() => {
    if (!imageContainerRef.current) return;

    function onScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        imageContainerRef.current;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < 10) setIsBottom(true);
    }

    imageContainerRef.current.addEventListener('scroll', onScroll);
  }, [imageContainerRef.current]);

  useEffect(() => {
    async function setNewImages() {
      if (
        !isBottom ||
        !imagesRef.current ||
        images.length === 0 ||
        images.length >= imagesRef.current.length
      )
        return;

      const startIndex = startIndexRef.current;
      const endIndex = startIndexRef.current + MAX_IMAGES;

      const slicedItems = imagesRef.current.slice(startIndex, endIndex);
      const newImages = [...images, ...slicedItems];

      setImages(newImages);
      startIndexRef.current = endIndex;
      setIsBottom(false);
    }
    setNewImages();
  }, [isBottom]);

  return { images, setImages, imageContainerRef, storageRef };
}

export default function Compose() {
  const { user, isPopout } = useContext(AuthContext);

  const [draggingIndex, setDraggingIndex] = useState(null);
  const [buttonAction, setButtonAction] = useState(null);

  const { images, setImages, imageContainerRef, storageRef } = useImages(user);
  const {
    visionBoard,
    activeItem,
    setActiveItem,
    bgColor,
    setBgColor,
    textConfig,
    setTextConfig,
    isSaving,
    saveProject,
  } = useVisionBoard(user, images, draggingIndex);

  const navigate = useNavigate();

  function deleteActiveItem() {
    if (!activeItem || !visionBoard) return;

    visionBoard.remove(activeItem);
    visionBoard.renderAll();
    saveProject();
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
      hasControls: false,
      lockScalingX: true,
      lockScalingY: true,
    });
    visionBoard.add(newText).setActiveObject(newText);
    setActiveItem(newText);
  }

  async function clear() {
    visionBoard.clear();
    setBgColor('#F4F3EF');
    setTextConfig({
      color: '#000',
      fontSize: 16,
    });
    setActiveItem(null);

    const { template } = await getTemplate();
    visionBoard.loadFromJSON(template);

    saveProject();
  }

  return (
    <Container>
      {isPopout && (
        <Alert
          type={buttonAction === 'clear' ? 'sad' : 'success'}
          title={buttonAction === 'clear' ? '確定要重置嗎？' : '儲存成功！'}
          buttonConfig={[
            {
              buttonType: buttonAction === 'clear' ? 'light' : 'dark',
              value: buttonAction === 'clear' ? '取消重置' : '確認結果',
              action: () =>
                navigate(buttonAction === 'clear' ? '/compose' : '/profile'),
            },
            buttonAction === 'clear'
              ? {
                  buttonType: 'dark',
                  value: '確認重置',
                  action: clear,
                }
              : null,
          ].filter(Boolean)}
        />
      )}

      <PageTitle>Vision Board</PageTitle>

      <BoardContainer>
        {isSaving ? (
          <SavePrompt>
            Saving<SavingDot>.</SavingDot>
            <SecondSavingDot>.</SecondSavingDot>
            <ThirdSavingDot>.</ThirdSavingDot>
          </SavePrompt>
        ) : (
          <SavePrompt>Saved</SavePrompt>
        )}

        <ImageUpload
          storageRef={storageRef}
          images={images}
          setImages={setImages}
          imageContainerRef={imageContainerRef}
          setDraggingIndex={setDraggingIndex}
        />

        <VisionBoard
          bgColor={bgColor}
          setBgColor={setBgColor}
          activeItem={activeItem}
          textConfig={textConfig}
          setTextConfig={setTextConfig}
          setButtonAction={setButtonAction}
          addText={addText}
          deleteActiveItem={deleteActiveItem}
          saveProject={saveProject}
        />
      </BoardContainer>
      <Background />
    </Container>
  );
}
