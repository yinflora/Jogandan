import { useState, useEffect, useContext, useRef } from 'react';
import { fabric } from 'fabric';
import styled from 'styled-components';
import AuthContext from '../../context/authContext';
import {
  storage,
  // uploadTemplate,
  getTemplate,
  setNewBoard,
  saveBoard,
  // getBoard,
} from '../../utils/firebase';
import {
  ref,
  listAll,
  // uploadBytesResumable,
  uploadBytes,
  getDownloadURL,
  getMetadata,
  uploadString,
} from 'firebase/storage';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ToolWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
`;

const Button = styled.button`
  border: 1px solid black;
`;

// const TextButton = styled.button``;

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
  // const [undo, setUndo] = useState([]);
  // const [redo, setRedo] = useState([]);
  const canvasRef = useRef(null);
  const boardIdRef = useRef(null);

  const storageRef = ref(storage, `/${uid}/images/`);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await listAll(storageRef);
        // const urls = await Promise.all(
        //   // res.items.map((itemRef) => getDownloadURL(itemRef))
        //   res.items.map((itemRef) => getMetadata(itemRef))
        // );
        const data = await Promise.all(
          // res.items.map((itemRef) => getDownloadURL(itemRef))
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

        // console.log(newData);

        // console.log(metaData, urls);
        // setImages(urls.reverse());
        setImages(newUrls);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImages();
  }, [uid, isUploaded]);

  // function setLayout1(canvas) {
  //   const clipPathTopL = new fabric.Rect({
  //     width: 240,
  //     height: 240,
  //     left: 255,
  //     top: 5,
  //     fill: '#7e807c',
  //     isClipFrame: true,
  //   });

  //   const clipPathTopR = new fabric.Rect({
  //     width: 240,
  //     height: 240,
  //     left: 5,
  //     top: 5,
  //     fill: '#7e807c',
  //     isClipFrame: true,
  //   });

  //   const clipPathMiddleL = new fabric.Rect({
  //     width: 240,
  //     height: 240,
  //     left: 5,
  //     top: 5,
  //     fill: '#7e807c',
  //     isClipFrame: true,
  //   });

  //   const clipPathMiddleR = new fabric.Rect({
  //     width: 240,
  //     height: 240,
  //     left: 5,
  //     top: 5,
  //     fill: '#7e807c',
  //     isClipFrame: true,
  //   });

  //   const colorPalette = new fabric.Rect({
  //     width: 100,
  //     height: 100,
  //     left: 5,
  //     top: 5,
  //     fill: '#acaea9',
  //     isClipFrame: true,
  //   });

  //   const textArea = new fabric.Rect({
  //     width: 240,
  //     height: 240,
  //     left: 5,
  //     top: 5,
  //     fill: '#acaea9',
  //     isClipFrame: false,
  //   });

  //   canvas.add(clipPathTopL);
  //   canvas.add(clipPathTopR);
  //   canvas.add(clipPathMiddleL);
  //   canvas.add(clipPathMiddleR);
  //   canvas.add(colorPalette);
  //   canvas.add(textArea);
  // }

  async function loadTemplate(canvas) {
    const data = await getTemplate();
    console.log('Got template:', data.template);
    // canvas.loadFromJSON(template);
    canvas.loadFromJSON(
      data.template
      // canvas.renderAll.bind(canvas)
    );
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas('canvas', {
        // crossOrigin: 'Anonymous',
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
        backgroundColor: bgColor,
      });

      loadTemplate(canvas);

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
      //   customProps: { isClipFrame: true },
      //   // customProps: { isClipFrame: true },
      // });

      // const clipPathBottom = new fabric.Rect({
      //   width: 240,
      //   height: 240,
      //   left: 5,
      //   top: 5, acaea9
      //   // stroke: 'red',
      //   // strokeWidth: 1,
      //   // strokeDashArray: [5, 5],
      //   fill: 'black',
      //   // selectable: false,
      //   isClipFrame: true,
      // });

      // canvas.add(clipPathTop);
      // canvas.add(clipPathBottom);
      // setLayout1(canvas);

      setVisionBoard(canvas);
      setSavedRecord(JSON.stringify(canvas));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (!uid || !visionBoard) return;

    async function createBoard() {
      const hasBoardId = localStorage.getItem('boardId');
      // console.log(hasBoardId);
      if (hasBoardId) {
        // console.log('有id囉');
        boardIdRef.current = localStorage.getItem('boardId');
        console.log(boardIdRef.current);
      } else {
        // console.log('迷ｕ');
        const boardId = await setNewBoard(uid, JSON.stringify(visionBoard));
        localStorage.setItem('boardId', boardId);
        boardIdRef.current = boardId;
        console.log(boardIdRef.current);
      }
    }

    // async function loadPrevBoard() {
    //   const prevData = await getBoard(uid, boardIdRef.current);
    //   console.log(prevData);
    //   visionBoard.loadFromJSON(prevData.data);
    // }

    createBoard();
    // loadPrevBoard();
  }, [uid, visionBoard]);

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

      fabric.Image.fromURL(
        movingImage,
        (img) => {
          const image = img.set({
            // crossOrigin: 'anonymous',
            left: target.left,
            top: target.top,
            clipPath,
          });

          // image.crossOrigin = 'Anonymous';
          image.scaleToWidth(target.getScaledWidth());
          const isFullHeight = image.getScaledHeight() < target.height;
          if (isFullHeight) image.scaleToHeight(target.getScaledHeight());
          image.lockMovementY = isFullHeight;
          image.lockMovementX = !isFullHeight;

          image.clipPath = clipPath;

          visionBoard.add(image); // 記得還是要加進 canvas 才會顯示出來呦
        },
        { crossOrigin: 'anonymous' }
      );
    }

    visionBoard.on('drop', dropImage);

    return () => visionBoard.off('drop', dropImage);
  }, [visionBoard, draggingIndex]);

  useEffect(() => {
    if (!visionBoard) return;

    function findActiveObject() {
      const activeObject = visionBoard.getActiveObject();
      console.log(activeObject);
      if (activeObject && activeObject.type === 'i-text')
        setTextConfig({
          color: activeObject.fill,
          fontSize: activeObject.fontSize,
        });
    }
    visionBoard.on('mouse:down', findActiveObject);

    return () => visionBoard.off('mouse:down', findActiveObject);
  }, [visionBoard]);

  //Todo: undo & redo
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

    // for (let i = 0; i < files.length; i++) {
    //   const file = files[i];
    //   const imageRef = ref(storageRef, `${file.name}`);
    //   const uploadTask = uploadBytesResumable(imageRef, file);

    //   uploadTask.on(
    //     'state_changed',
    //     null,
    //     (err) => console.log(err),
    //     () => {
    //       getDownloadURL(uploadTask.snapshot.ref).then(() => {
    //         setIsUploaded(!isUploaded);
    //       });
    //     }
    //   );
    // }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageRef = ref(storageRef, `${file.name}`);

      uploadBytes(imageRef, file).then(() => {
        console.log('Uploaded a file!');
        setIsUploaded(!isUploaded);
      });

      // getDownloadURL(imageRef).then(() => setIsUploaded(!isUploaded));
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

  // async function uploadBoard() {
  //   //Todo: 存到firestore
  //   setSavedRecord(JSON.stringify(visionBoard));

  //   await uploadTemplate(JSON.stringify(visionBoard));
  // }

  async function save() {
    //Todo: 存到firestore

    // setSavedRecord(JSON.stringify(visionBoard));
    // await uploadTemplate(JSON.stringify(visionBoard));

    const dataURL = visionBoard.toDataURL();
    const imageRef = ref(storageRef, `${boardIdRef.current}`);

    // uploadString(imageRef, dataURL, 'data_url').then((snapshot) => {
    //   getDownloadURL(snapshot.ref).then((url) => (newURL = url));
    // });

    const snapshot = await uploadString(imageRef, dataURL, 'data_url');
    const newURL = await getDownloadURL(snapshot.ref);

    console.log(newURL);

    await saveBoard(
      uid,
      boardIdRef.current,
      JSON.stringify(visionBoard),
      newURL
      // null
    );
  }

  function load() {
    //Todo: 從firestore取出資料
    // const template = await getTemplate();
    // console.log('Got template:', template);

    visionBoard.loadFromJSON(savedRecord);
    // visionBoard.loadFromJSON(template);
  }

  async function clear() {
    visionBoard.clear();
    const data = await getTemplate();
    visionBoard.loadFromJSON(data.template);
  }

  // function clear() {
  //   visionBoard.clear();
  // }
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
          <span>{textConfig.fontSize}</span>
        </div>
        <Button onClick={addText}>Text</Button>
        {/* <button>undo</button>
        <button>redo</button> */}
        <Button onClick={save}>Save</Button>
        <Button onClick={load}>Load</Button>
        <Button onClick={clear}>Clear</Button>
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