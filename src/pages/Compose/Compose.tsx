import { useState, useEffect, useContext, useRef } from 'react';
import { fabric } from 'fabric';
import styled from 'styled-components';
import AuthContext from '../../context/authContext';
import { storage } from '../../utils/firebase';
import {
  ref,
  listAll,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import userEvent from '@testing-library/user-event';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ToolWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const BackgroundColor = styled.div`
  display: flex;
  width: 70%;
  aspect-ratio: 5/4;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fbfbf9;
`;

const ImageUpload = styled.input``;

const ImageToolBar = styled.div`
  width: 30%;
  background-color: #343434;
  overflow-y: scroll;
`;

const ImageWrapper = styled.div`
  display: flex;
  height: 100%;
  max-height: 500px;
  flex-wrap: wrap;
  overflow-y: scroll;
  gap: 10px;
`;

const Image = styled.img`
  height: 100px;
`;

const VisionBoard = styled.div`
  display: grid;
  width: 60%;
  aspect-ratio: 1/1;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(14, 1fr);
  grid-gap: 10px;
  grid-template-areas:
    'topLeft topLeft topLeft topRight topRight topRight .'
    'topLeft topLeft topLeft topRight topRight topRight .'
    'topLeft topLeft topLeft middleRightL middleRightL middleRightL middleRightL'
    'topLeft topLeft topLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightL middleRightL middleRightL middleRightL'
    'middleLeft middleLeft middleLeft middleRightM middleRightM middleRightM middleRightM'
    'middleLeft middleLeft middleLeft middleRightM middleRightM middleRightM middleRightM'
    '. bottomLeft bottomLeft middleRightM middleRightM middleRightM middleRightM'
    '. bottomLeft bottomLeft middleRightM middleRightM middleRightM middleRightM'
    '. bottomLeft bottomLeft bottomRight bottomRight bottomRight bottomRight'
    '. bottomLeft bottomLeft bottomRight bottomRight bottomRight bottomRight';
  background-color: #000;
`;

const VisionBoard2 = styled.div`
  width: 70%;
  aspect-ratio: 5/4;
  background-color: #000;
`;

const ImageBlock = styled.div<ComposeProp>`
  background: ${({ url }) =>
    url === '' ? '#FFF' : `center / cover no-repeat url(${url})`};
`;

const TopLeftBlock = styled(ImageBlock)`
  grid-area: topLeft;
`;

const TopRightBlock = styled(ImageBlock)`
  grid-area: topRight;
`;

const MiddleLeftBlock = styled(ImageBlock)`
  grid-area: middleLeft;
`;

const MiddleRightLargeBlock = styled(ImageBlock)`
  grid-area: middleRightL;
`;

const MiddleRightMediumBlock = styled.div`
  grid-area: middleRightM;
`;

const TextButton = styled.button``;

const BottomLeftBlock = styled(ImageBlock)`
  grid-area: bottomLeft;
`;

const BottomRightBlock = styled.div`
  grid-area: bottomRight;
  display: flex;
  gap: 10px;
  background-color: black;
`;

const ColorBlock = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

type ComposeProp = {
  url: string;
};

export default function Compose() {
  const { uid } = useContext(AuthContext);

  const [images, setImages] = useState<string[] | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const [savedRecord, setSavedRecord] = useState(null);
  const [visionBoard, setVisionBoard] = useState(null);
  const [bgColor, setBgColor] = useState('#fbfbf9');
  const [textConfig, setTextConfig] = useState({
    color: '#000',
    fontSize: 16,
  });
  const [undo, setUndo] = useState([]);
  const [redo, setRedo] = useState([]);

  const [textCanvas, setTextCanvas] = useState(null);
  const [data, setData] = useState([
    { position: 'topLeft', url: '' },
    { position: 'topRight', url: '' },
    { position: 'middleLeft', url: '' },
    { position: 'middleRightL', url: '' },
    { position: 'middleRightM', url: '' },
    { position: 'bottomLeft', url: '' },
    { position: 'bottomRight', url: '' },
  ]);

  const canvasRef = useRef(null);
  const textContainerRef = useRef(null);
  const storageRef = ref(storage, `/${uid}/images/`);

  const defaultColor = '#000';
  const defaultFontSize = 16;

  // useEffect(() => {
  //   if (textContainerRef.current) {
  //     const canvas = new fabric.Canvas('textCanvas', {
  //       width: textContainerRef.current.clientWidth,
  //       height: textContainerRef.current.clientHeight,
  //       backgroundColor: '#F3F9D2',
  //     });
  //     setTextCanvas(canvas);
  //   }
  // }, [textContainerRef]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await listAll(storageRef);
        const urls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setImages(urls);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, [uid, isUploaded]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas('canvas', {
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
        backgroundColor: bgColor,
      });

      const clipPathTop = new fabric.Rect({
        width: 240,
        height: 240,
        left: 255,
        top: 5,
        stroke: 'red',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        fill: 'rgba(255,255,255,0.2)',
        selectable: false,
        isClipFrame: true,
      });

      const clipPathBottom = new fabric.Rect({
        width: 240,
        height: 240,
        left: 5,
        top: 5,
        stroke: 'red',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        fill: 'rgba(255,255,255,0.2)',
        selectable: false,
        isClipFrame: true,
      });

      canvas.add(clipPathTop);
      canvas.add(clipPathBottom);

      setVisionBoard(canvas);
      setSavedRecord(canvas.toJSON());

      //   canvas.on('drop', (e) => {
      //     const rect = canvas.getBoundingClientRect();
      //     const x = e.clientX - rect.left,
      //    const y =  e.clientY - rect.top,
      //     const movingImage = images[draggingIndex];
      //    const image = new fabric.Image.fromURL(movingImage, {
      //     width: movingImage.naturalWidth,
      // height: movingImage.naturalHeight,
      // scaleX: 100 / movingImage.naturalWidth,
      // scaleY: 100 / movingImage.naturalHeight,
      // top: y - e.clientY - e.target.offsetTop, // 計算起始位置
      // left: x - e.clientX - e.target.offsetLeft
      //    })
      //   });
    }
  }, [canvasRef]);

  useEffect(() => {
    // if (!visionBoard || draggingIndex === null || images === null) return;
    if (!visionBoard || draggingIndex === null || images === null) return;

    function dropImage(e) {
      console.log(e.target);

      const target = e.target;
      let clipPath;

      if (!target.isClipFrame) return;
      // 設定匯入圖塊
      target.clone((cloned) => (clipPath = cloned));
      clipPath.absolutePositioned = true;

      const movingImage = images[draggingIndex];
      console.log(movingImage);

      // const image = new fabric.Image.fromURL(movingImage, {
      //   width: movingImage.naturalWidth,
      //   height: movingImage.naturalHeight,
      //   left: target.left,
      //   top: target.top,
      //   clipPath,
      // });

      // console.log(image);
      // // 判斷長寬是否為滿版來做調整並鎖定 X Y
      // image.scaleToWidth(target.width);
      // const isFullHeight = image.getScaledHeight() < target.height;
      // if (isFullHeight) image.scaleToHeight(target.height);
      // image.lockMovementY = isFullHeight;
      // image.lockMovementX = !isFullHeight;

      // image.clipPath = clipPath;

      // const image = new fabric.Image(movingImage, {
      //   width: movingImage.naturalWidth,
      //   height: movingImage.naturalHeight,
      //   left: target.left,
      //   top: target.top,
      //   clipPath,
      // });
      // // 判斷長寬是否為滿版來做調整並鎖定 X Y
      // image.scaleToWidth(target.getScaledWidth());
      // const isFullHeight = image.getScaledHeight() < target.height;
      // if (isFullHeight) image.scaleToHeight(target.getScaledHeight());
      // image.lockMovementY = isFullHeight;
      // image.lockMovementX = !isFullHeight;

      // image.clipPath = clipPath;
      // visionBoard.add(image);

      fabric.Image.fromURL(movingImage, (img) => {
        const image = img.set({
          // width: img.naturalWidth,
          // height: img.naturalHeight,
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

        visionBoard.add(image); // 記得還是要加進 canvas 才會顯示出來呦

        console.log(image.width, image.height);
      });

      console.log(visionBoard.toJSON());
    }

    visionBoard.on('drop', dropImage);

    // return () => {visionBoard.off('drop')}
  }, [visionBoard, draggingIndex]);

  // useEffect(() => {
  //   if (!visionBoard) return;

  //   visionBoard.on('object:modified', () => {
  //     setUndo([...undo, savedRecord]);
  //   });
  // }, [visionBoard]);

  //換背景顏色
  useEffect(() => {
    if (visionBoard) {
      visionBoard.setBackgroundColor(bgColor, () => {
        visionBoard.renderAll();
      });
    }
  }, [visionBoard, bgColor]);

  useEffect(() => {
    if (!visionBoard) return;
    const activeObject = visionBoard.getActiveObject();

    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set({
        fill: textConfig.color,
        fontSize: textConfig.fontSize,
      });
      visionBoard.renderAll();
      // setTextCanvas(textCanvas);
    }
  }, [textConfig]);

  // useEffect(() => {
  //   if (!textCanvas) return;
  //   const activeObject = textCanvas.getActiveObject();

  //   if (activeObject && activeObject.type === 'i-text') {
  //     // Update its properties with the current textConfig values
  //     activeObject.set({
  //       fill: textConfig.color || defaultColor,
  //       fontSize: textConfig.fontSize || defaultFontSize,
  //     });
  //     // Trigger canvas render and update state
  //     textCanvas.renderAll();
  //     setTextCanvas(textCanvas);
  //   }
  // }, [textConfig]);

  // useEffect(() => {
  //   if (!textCanvas) return;
  //   const activeObject = textCanvas.getActiveObject();

  //   if (activeObject && activeObject.type === 'i-text') {
  //     // Update its properties with the current textConfig values
  //     activeObject.set({
  //       fill: textConfig.color || defaultColor,
  //       fontSize: textConfig.fontSize || defaultFontSize,
  //     });
  //     // Trigger canvas render and update state
  //     textCanvas.renderAll();
  //     setTextCanvas(textCanvas);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!textCanvas) return;

  //   function handleSave() {
  //     console.log(textCanvas.toJSON());
  //   }

  //   const timeoutId = setTimeout(handleSave, 10000);

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [textCanvas]);

  function handleFileUpload(e) {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storageRef, `${file.name}`);
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(() => {
            setIsUploaded(!isUploaded);
          });
        }
      );
    }
    return null;
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, position: string) {
    e.preventDefault();

    if (draggingIndex !== null) {
      const imageUrl = images && images[draggingIndex];
      const newData = [...data];
      newData.find((item) => item.position === position)!.url = imageUrl!;
      setData(newData);
      setDraggingIndex(null);
      console.log(
        `Dropped image at ${position}, index=${draggingIndex}, url=${imageUrl}`
      );
    }
  }

  function addText() {
    const text = new fabric.IText('請輸入文字', {
      top: 10,
      left: 10,
      fill: textConfig.color || defaultColor,
      fontSize: textConfig.fontSize || defaultFontSize,
    });
    visionBoard.add(text).setActiveObject(text);
  }

  function save() {
    //Todo: 存到firestore
    setSavedRecord(visionBoard.toJSON());
  }

  function load() {
    //Todo: 從firestore取出資料
    visionBoard.loadFromJSON(savedRecord);
  }

  function clear() {
    visionBoard.clear();
  }
  return (
    <Container>
      <ToolWrapper>
        <div>
          <label>Back-ground color:</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </div>
        <div>
          <label>Text color:</label>
          <input
            type="color"
            // defaultValue="#000"
            value={textConfig.color}
            onChange={(e) =>
              setTextConfig({ ...textConfig, color: e.target.value })
            }
          />
        </div>
        <div>
          <label>Font size:</label>
          <input
            type="range"
            min="10"
            max="40"
            defaultValue="16"
            value={textConfig.fontSize}
            onChange={(e) =>
              setTextConfig({ ...textConfig, fontSize: Number(e.target.value) })
            }
          />
        </div>
        <TextButton onClick={addText}>T</TextButton>
        <button>undo</button>
        <button>redo</button>
        <button onClick={save}>Save</button>
        <button onClick={load}>Load</button>
        <button onClick={clear}>Clear</button>
      </ToolWrapper>
      <ImageToolBar>
        <ImageUpload
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e)}
          multiple
        />
        <ImageWrapper>
          {images &&
            images.map((item, index) => (
              <Image
                key={index}
                src={item}
                draggable
                onDragStart={() => {
                  console.log(index);
                  setDraggingIndex(index);
                }}
                onDragEnd={() => setDraggingIndex(null)}
              />
            ))}
        </ImageWrapper>
      </ImageToolBar>

      <VisionBoard2 ref={canvasRef}>
        <canvas id="canvas" />
      </VisionBoard2>
      {/* <BackgroundColor>
        <VisionBoard>
          <TopLeftBlock
            url={data[0].url}
            onDrop={(e) => handleDrop(e, 'topLeft')}
            onDragOver={(e) => e.preventDefault()}
          />
          <TopRightBlock
            url={data[1].url}
            onDrop={(e) => handleDrop(e, 'topRight')}
            onDragOver={(e) => e.preventDefault()}
          />
          <MiddleLeftBlock
            url={data[2].url}
            onDrop={(e) => handleDrop(e, 'middleLeft')}
            onDragOver={(e) => e.preventDefault()}
          />
          <MiddleRightLargeBlock
            url={data[3].url}
            onDrop={(e) => handleDrop(e, 'middleRightL')}
            onDragOver={(e) => e.preventDefault()}
          />
          <MiddleRightMediumBlock ref={textContainerRef}>
            <canvas id="textCanvas" />
          </MiddleRightMediumBlock>
          <BottomLeftBlock
            url={data[5].url}
            onDrop={(e) => handleDrop(e, 'bottomLeft')}
            onDragOver={(e) => e.preventDefault()}
          />
          <BottomRightBlock>
            <ColorBlock></ColorBlock>
            <ColorBlock></ColorBlock>
            <ColorBlock></ColorBlock>
            <ColorBlock></ColorBlock>
          </BottomRightBlock>
        </VisionBoard>
      </BackgroundColor> */}
    </Container>
  );
}
