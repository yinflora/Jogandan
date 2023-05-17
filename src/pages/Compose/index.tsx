import { fabric } from 'fabric';
import { getDownloadURL, getMetadata, listAll, ref } from 'firebase/storage';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components/macro';
import Alert from '../../components/Alert';
import UserInfoContext from '../../context/UserInfoContext';
import { TextConfigType, UserType, VisionBoardType } from '../../types/types';
import * as firebase from '../../utils/firebase';
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

const useVisionBoard = (
  user: UserType,
  images: string[],
  draggingIndex: number | null
) => {
  const [visionBoard, setVisionBoard] = useState<any | null>(null);
  const [activeItem, setActiveItem] = useState<fabric.Object | null>(null);
  const [bgColor, setBgColor] = useState<string>('#F4F3EF');
  const [textConfig, setTextConfig] = useState<TextConfigType>({
    color: '#000',
    fontSize: 16,
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const saveProject = async () => {
    if (!visionBoard) return;

    setIsSaving(true);

    const visionBoardData = visionBoard.toJSON([
      'isClipFrame',
      'selectable',
      'hasControls',
      'hoverCursor',
    ]);

    await firebase.saveBoard(visionBoardData, true);

    setTimeout(() => setIsSaving(false), 1000);
  };

  useEffect(() => {
    if (!user) return;
    const setBoard = async () => {
      try {
        const canvas = new fabric.Canvas('canvas', {
          width: 625,
          height: 475,
          backgroundColor: bgColor,
        });

        const { data } = user.visionBoard;
        canvas.loadFromJSON(data, () => null);

        setVisionBoard(canvas);
        setBgColor(data.background);
      } catch (error) {
        throw new Error(String(error));
      }
    };
    setBoard();
  }, [user]);

  useEffect(() => {
    if (!visionBoard) return;

    const setActiveObject = () => {
      const activeObject = visionBoard.getActiveObject();
      setActiveItem(activeObject);

      if (activeObject && activeObject.type === 'i-text') {
        setTextConfig({
          color: activeObject.fill,
          fontSize: activeObject.fontSize,
        });
      }
    };

    const dropImage = (e: any) => {
      if (draggingIndex === null || images.length === 0) return;
      const target = e.target;
      let clipPath: fabric.Object | undefined;

      if (!target.isClipFrame) return;

      target.clipPath = null;
      target.clone((cloned: fabric.Object) => (clipPath = cloned));

      if (!clipPath) return;
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
    };

    visionBoard.on('mouse:down', setActiveObject);
    visionBoard.on('drop', dropImage);
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
};

const useImages = (user: UserType) => {
  const [images, setImages] = useState<string[]>([]);
  const [isBottom, setIsBottom] = useState<boolean>(false);

  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const startIndexRef = useRef<number>(0);
  const imagesRef = useRef<string[] | null>(null);

  const storageRef = ref(firebase.storage, `/${user.uid}/images/`);
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
        const newData = data.map((metadata, index) => {
          return {
            metadata,
            url: urls[index],
          };
        });
        newData.sort(
          (a, b) =>
            Number(new Date(b.metadata.updated)) -
            Number(new Date(a.metadata.updated))
        );

        const newUrls = newData.map((item) => item.url);
        imagesRef.current = newUrls;

        const startIndex = startIndexRef.current;
        const endIndex = startIndexRef.current + MAX_IMAGES;

        const slicedItems = newUrls.slice(startIndex, endIndex);
        const newImages = [...images, ...slicedItems];

        setImages(newImages);

        startIndexRef.current = endIndex;
      } catch (error) {
        throw new Error(String(error));
      }
    };

    fetchImages();
  }, [user]);

  useEffect(() => {
    const onScroll = () => {
      if (!imageContainerRef.current) return;

      const { scrollTop, clientHeight, scrollHeight } =
        imageContainerRef.current;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < 10) setIsBottom(true);
    };

    imageContainerRef.current?.addEventListener('scroll', onScroll);
  }, [imageContainerRef.current]);

  useEffect(() => {
    const setNewImages = async () => {
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
    };
    setNewImages();
  }, [isBottom]);

  return { images, setImages, imageContainerRef, storageRef };
};

const Compose = () => {
  const { user, isPopout } = useContext(UserInfoContext);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [buttonAction, setButtonAction] = useState<string | null>(null);

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

  const deleteActiveItem = () => {
    if (!activeItem || !visionBoard) return;

    visionBoard.remove(activeItem);
    visionBoard.renderAll();
    saveProject();
  };

  const addText = () => {
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
  };

  const clear = async () => {
    visionBoard.clear();
    setBgColor('#F4F3EF');
    setTextConfig({
      color: '#000',
      fontSize: 16,
    });
    setActiveItem(null);

    const { template } = (await firebase.getTemplate()) as VisionBoardType;
    visionBoard.loadFromJSON(template);

    saveProject();
  };

  return (
    <Container>
      {isPopout && (
        <Alert
          type={buttonAction === 'clear' ? 'sad' : 'success'}
          title={buttonAction === 'clear' ? '確定要重置嗎？' : '儲存成功！'}
          buttonConfig={
            buttonAction === 'clear'
              ? [
                  {
                    buttonType: 'light',
                    value: '取消重置',
                    action: () => navigate('/compose'),
                  },
                  {
                    buttonType: 'dark',
                    value: '確認重置',
                    action: clear,
                  },
                ]
              : [
                  {
                    buttonType: 'dark',
                    value: '確認結果',
                    action: () => navigate('/profile'),
                  },
                ]
          }
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
};

export default Compose;
