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

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ToolWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const TextButton = styled.button``;

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

const VisionBoard2 = styled.div`
  width: 70%;
  aspect-ratio: 5/4;
  background-color: #000;
`;

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
  // const [undo, setUndo] = useState([]);
  // const [redo, setRedo] = useState([]);

  const canvasRef = useRef(null);
  const storageRef = ref(storage, `/${uid}/images/`);

  // const defaultColor = '#000';
  // const defaultFontSize = 16;

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

  function setLayout1(canvas) {
    const clipPathTopL = new fabric.Rect({
      width: 240,
      height: 240,
      left: 255,
      top: 5,
      fill: 'black',
      isClipFrame: true,
    });

    const clipPathTopR = new fabric.Rect({
      width: 240,
      height: 240,
      left: 5,
      top: 5,
      fill: 'black',
      isClipFrame: true,
    });

    const clipPathMiddleL = new fabric.Rect({
      width: 240,
      height: 240,
      left: 5,
      top: 5,
      fill: 'black',
      isClipFrame: true,
    });

    const clipPathMiddleR = new fabric.Rect({
      width: 240,
      height: 240,
      left: 5,
      top: 5,
      fill: 'black',
      isClipFrame: true,
    });

    const colorPalette = new fabric.Rect({
      width: 100,
      height: 100,
      left: 5,
      top: 5,
      fill: 'black',
      isClipFrame: true,
    });

    const textArea = new fabric.Rect({
      width: 240,
      height: 240,
      left: 5,
      top: 5,
      fill: 'black',
      isClipFrame: true,
    });

    canvas.add(clipPathTopL);
    canvas.add(clipPathTopR);
    canvas.add(clipPathMiddleL);
    canvas.add(clipPathMiddleR);
    canvas.add(colorPalette);
    canvas.add(textArea);
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas('canvas', {
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
        backgroundColor: bgColor,
      });

      // const clipPathTop = new fabric.Rect({
      //   width: 240,
      //   height: 240,
      //   left: 255,
      //   top: 5,
      //   // stroke: 'red',
      //   // strokeWidth: 1,
      //   // strokeDashArray: [5, 5],
      //   fill: 'black',
      //   // selectable: false,
      //   isClipFrame: true,
      // });

      // const clipPathBottom = new fabric.Rect({
      //   width: 240,
      //   height: 240,
      //   left: 5,
      //   top: 5,
      //   // stroke: 'red',
      //   // strokeWidth: 1,
      //   // strokeDashArray: [5, 5],
      //   fill: 'black',
      //   // selectable: false,
      //   isClipFrame: true,
      // });

      // canvas.add(clipPathTop);
      // canvas.add(clipPathBottom);
      setLayout1(canvas);

      setVisionBoard(canvas);
      setSavedRecord(canvas.toJSON());
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!visionBoard || draggingIndex === null || images === null) return;

    function dropImage(e) {
      console.log(e.target);

      const target = e.target;
      let clipPath;

      if (!target.isClipFrame) return;

      // Remove all previously added images
      // visionBoard.getObjects().forEach((obj) => {
      //   if (obj.type === 'image') {
      //     visionBoard.remove(obj);
      //   }
      // });
      // 設定匯入圖塊

      target.clipPath = null;
      target.clone((cloned) => (clipPath = cloned));
      clipPath.absolutePositioned = true;

      const movingImage = images[draggingIndex];

      console.log(movingImage);

      fabric.Image.fromURL(movingImage, (img) => {
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

        visionBoard.add(image); // 記得還是要加進 canvas 才會顯示出來呦

        console.log(image.width, image.height);
      });

      console.log(visionBoard.toJSON());
    }

    visionBoard.on('drop', dropImage);
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
    }
  }, [textConfig]);

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

  function addText() {
    const text = new fabric.IText('請輸入文字', {
      top: 10,
      left: 10,
      fill: textConfig.color,
      fontFamily: 'Raleway',
      fontSize: textConfig.fontSize,
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
        {/* <button>undo</button>
        <button>redo</button> */}
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
    </Container>
  );
}
