import { useRef, useEffect, useState } from 'react';
import {
  createBoard,
  updateLines,
  updateShapes,
  resetBoard,
  getBoard,
} from '../../utils/firebase';

export default function Canvas() {
  const [tool, setTool] = useState<string | null>(null);
  const [color, setColor] = useState<string>('#000');
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [shape, setShape] = useState<string | null>(null);
  // const [file, setFile] = useState(null);
  const [text, setText] = useState<string | null>(null);
  const [boardId, setBoardId] = useState<string | null>(null);
  // const [imgElement, setImgElement] = useState(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const startPointRef = useRef<object>({ x: 0, y: 0 });
  const lastPointRef = useRef<object>({ x: 0, y: 0 });
  const lineRef = useRef<object[]>([]);
  // const distanceMovedRef = useRef<number>(0);
  const shapeRef = useRef<object | null>(null);
  // const imageRef = useRef<HTMLCanvasElement>(null);

  const isDraggingRef = useRef<boolean>(false);
  const isSelectedRef = useRef<boolean>(false);
  const selectedRef = useRef<object | null>(null);

  // let isDown = null;
  // let dragTarget = null;
  // let startX = null;
  // let startY = null;

  async function startDragging(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    startPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isSelectedRef.current = await findTarget(
      startPointRef.current.x,
      startPointRef.current.y
    );
    // console.log(isSelected);

    if (isSelectedRef.current) isDraggingRef.current = true;
  }

  function drag(e) {
    if (!isDraggingRef.current) return;
    if (!selectedRef.current) return;
    if (tool !== null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log(`Move:(${x},${y})`);

    const startX = startPointRef.current.x;
    const startY = startPointRef.current.y;

    console.log(`Start:(${startX},${startY})`);

    //假設是要移動長方形
    const rectWidth = selectedRef.current.endX - selectedRef.current.startX;
    const rectHeight = selectedRef.current.endY - selectedRef.current.startY;

    console.log(rectWidth, rectHeight);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.rect(x, y, rectWidth, rectHeight);
    ctx.fill();
  }

  function endDragging() {
    isDraggingRef.current = false;

    // const canvas = canvasRef.current;
    // if (!canvas) return;

    // const rect = canvas.getBoundingClientRect();
    // const endX = lastPointRef.current.x - rect.left;
    // const endY = lastPointRef.current.y - rect.top;
  }

  async function findTarget(x, y) {
    let isTarget = false;

    const boardData = await getBoard(boardId);
    const { lines, shapes } = boardData;

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      if (
        x >= shape.startX &&
        x <= shape.startX + shape.endX - shape.startX &&
        y >= shape.startY &&
        y <= shape.startY + shape.endY - shape.startY
      ) {
        // dragTarget = shape;
        selectedRef.current = shape;
        isTarget = true;
        // isSelectedRef.current = true;
        break;
      }
    }

    console.log(selectedRef.current);
    console.log(isTarget);
    return isTarget;
  }

  // async function hitTarget(x, y) {
  //   let isTarget = null;

  //   const boardData = await getBoard(boardId);
  //   const { lines, shapes } = boardData;

  //   for (let i = 0; i < shapes.length; i++) {
  //     const shape = shapes[i];
  //     if (
  //       x >= shape.startX &&
  //       x <= shape.startX + shape.endX - shape.startX &&
  //       y >= shape.startY &&
  //       y <= shape.startY + shape.endY - shape.startY
  //     ) {
  //       dragTarget = shape;
  //       isTarget = true;
  //       break;
  //     }
  //   }

  //   console.log(dragTarget);
  //   console.log(isTarget);
  //   return isTarget;
  // }

  // function handleMouseDown(e) {
  //   startX = parseInt(e.nativeEvent.offsetX - canvasRef.current.clientLeft);
  //   startY = parseInt(e.nativeEvent.offsetY - canvasRef.current.clientTop);
  //   isDown = hitTarget(startX, startY);
  // }

  // function handleMouseMove(e) {
  //   if (!isDown) return;

  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext('2d');
  //   if (!ctx) return;

  //   const mouseX = parseInt(
  //     e.nativeEvent.offsetX - canvasRef.current.clientLeft
  //   );
  //   const mouseY = parseInt(
  //     e.nativeEvent.offsetY - canvasRef.current.clientTop
  //   );
  //   const dx = mouseX - startX;
  //   const dy = mouseY - startY;
  //   startX = mouseX;
  //   startY = mouseY;
  //   dragTarget.startX += dx;
  //   dragTarget.startY += dy;
  //   console.log('moving');

  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;

  //   // ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   // ctx.fillStyle = 'gray';
  //   // ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   // const startX = startPointRef.current.x;
  //   // const startY = startPointRef.current.y;
  //   ctx.beginPath();
  //   ctx.rect(
  //     Math.min(dragTarget.endX, dragTarget.startX),
  //     Math.min(dragTarget.endY, dragTarget.startY),
  //     Math.abs(dragTarget.endX - dragTarget.startX),
  //     Math.abs(dragTarget.endY - dragTarget.startY)
  //   );
  //   ctx.fill();
  // }
  // useEffect(() => {
  //   // imageRef.current.addEventListener('mousedown', () =>
  //   //   console.log('有嗎有嗎')
  //   // );
  //   imgElement &&
  //     imgElement.addEventListener('mousedown', () => console.log('有嗎有嗎'));

  //   return () => {
  //     imgElement &&
  //       imgElement.removeEventListener('mousedown', () =>
  //         console.log('有嗎有嗎')
  //       );
  //   };
  // }, [imgElement]);

  // function startDragging(e) {
  //   const canvas = canvasRef.current;
  //   if (!canvas || !imageRef.current) return;

  //   !isDrawingRef.current && setIsDragging(true);
  // }

  // useEffect(() => {
  //   imageRef.current && console.log(imageRef.current);
  // }, []);

  useEffect(() => {
    const storageId = localStorage.getItem('boardId');

    async function getBoardId() {
      const id = await createBoard();
      localStorage.setItem('boardId', id);
      setBoardId(id);
    }
    storageId && setBoardId(storageId);
    storageId && renderBoard(storageId);

    !storageId && getBoardId();
  }, [boardId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // canvas.width = canvas.clientWidth;
    // canvas.height = canvas.clientHeight;
    canvas.width = 1000;
    canvas.height = 500;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // ctx.lineWidth = lineWidth;

    // Set canvas background to white
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = lineWidth;
  }, [lineWidth, color]);

  async function renderBoard(storageId) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const boardData = await getBoard(storageId);
    const { lines, shapes } = boardData;

    // console.log(lines, shapes);

    //render lines
    if (lines !== undefined) {
      for (const line of lines) {
        for (const point of line.points) {
          ctx.beginPath();
          ctx.moveTo(point.prevX, point.prevY);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = point.color;
          ctx.lineWidth = point.lineWidth;
          ctx.stroke();
        }
      }
    }

    // render shapes
    if (shapes !== undefined) {
      for (const shapeData of shapes) {
        ctx.fillStyle = shapeData.color;
        ctx.lineWidth = shapeData.lineWidth;

        const radius = Math.sqrt(
          Math.pow(shapeData.endX - shapeData.startX, 2) +
            Math.pow(shapeData.endY - shapeData.startY, 2)
        );

        switch (shapeData.type) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(shapeData.startX, shapeData.startY, radius, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'rectangle':
            ctx.beginPath();
            ctx.rect(
              Math.min(shapeData.endX, shapeData.startX),
              Math.min(shapeData.endY, shapeData.startY),
              Math.abs(shapeData.endX - shapeData.startX),
              Math.abs(shapeData.endY - shapeData.startY)
            );
            ctx.fill();
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(
              shapeData.startX,
              shapeData.startY - Math.abs(shapeData.endY - shapeData.startY)
            );
            ctx.lineTo(
              shapeData.startX -
                Math.abs(shapeData.endX - shapeData.startX) / 2,
              shapeData.startY + Math.abs(shapeData.endY - shapeData.startY)
            );
            ctx.lineTo(
              shapeData.startX +
                Math.abs(shapeData.endX - shapeData.startX) / 2,
              shapeData.startY + Math.abs(shapeData.endY - shapeData.startY)
            );
            ctx.closePath();
            ctx.fill();
            break;
          default:
            break;
        }
      }
    }
  }

  function startDrawing(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    startPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    // console.log(
    //   `start point - x: ${startPointRef.current.x},
    //   y: ${startPointRef.current.y}`
    // );

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;

    if (tool === 'draw') {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
  }

  function draw(e) {
    if (!isDrawingRef.current) return;
    if (tool !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // const line = lineRef.current;

    // const dx =
    //   x -
    //   (lineRef.current.length > 0
    //     ? lineRef.current[lineRef.current.length - 1].x
    //     : x);
    // const dy =
    //   y -
    //   (lineRef.current.length > 0
    //     ? lineRef.current[lineRef.current.length - 1].y
    //     : y);
    // const distance = Math.sqrt(dx * dx + dy * dy);
    // distanceMovedRef.current += distance;
    // lastPointRef.current = { x: e.clientX, y: e.clientY };

    // console.log(distance);

    ctx.lineTo(x, y);
    ctx.stroke();

    lineRef.current = [
      ...lineRef.current,
      {
        x,
        y,
        prevX:
          lineRef.current.length > 0
            ? lineRef.current[lineRef.current.length - 1].x
            : x,
        prevY:
          lineRef.current.length > 0
            ? lineRef.current[lineRef.current.length - 1].y
            : y,
        color,
        lineWidth,
      },
    ];
  }

  function drawShape(e) {
    if (!isDrawingRef.current) return;
    if (tool !== 'shape' && !shape) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
    // ctx.fillStyle = 'white'; // 將背景設置為白色
    // ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充白色背景
    // renderLines(); // 重新繪製線條

    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    const startX = startPointRef.current.x;
    const startY = startPointRef.current.y;
    const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));

    switch (shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(
          Math.min(x, startX),
          Math.min(y, startY),
          Math.abs(x - startX),
          Math.abs(y - startY)
        );
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(startX, startY - Math.abs(y - startY));
        ctx.lineTo(
          startX - Math.abs(x - startX) / 2,
          startY + Math.abs(y - startY)
        );
        ctx.lineTo(
          startX + Math.abs(x - startX) / 2,
          startY + Math.abs(y - startY)
        );
        ctx.closePath();
        ctx.fill();
        break;
      default:
        break;
    }

    lastPointRef.current = { x: e.clientX, y: e.clientY };
  }

  function endDrawing() {
    isDrawingRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const endX = lastPointRef.current.x - rect.left;
    const endY = lastPointRef.current.y - rect.top;

    // if (lineRef.current.length > 0 && distanceMovedRef.current >= 5) {
    //   lineRef.current = [];
    //   distanceMovedRef.current = 0;
    // }

    shapeRef.current = {
      type: shape,
      startX: startPointRef.current.x,
      startY: startPointRef.current.y,
      endX,
      endY,
      color,
      lineWidth,
    }; //Todo

    switch (tool) {
      case 'draw':
        isDrawingRef.current === false &&
          lineRef.current.length > 0 &&
          // console.log('更新線條');
          updateLines(boardId, lineRef.current);
        lineRef.current = [];
        // distanceMovedRef.current = 0;
        break;
      case 'shape':
        isDrawingRef.current === false &&
          // shapeRef.current !== null &&
          // console.log(shapeRef.current, '更新形狀');
          updateShapes(boardId, shapeRef.current);
        shapeRef.current = null;
        console.log(shapeRef.current);

        break;
      default:
        break;
    }
  }

  function drawImage(e) {
    const file = e.target.files[0];

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reader = new FileReader();
    reader.readAsDataURL(file); //使用 FileReader API 將圖片讀取為 Data URL

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // const imgScale = img.width / img.height;
        // // canvas.width = 700;
        // // canvas.height = 700;

        // ctx.drawImage(
        //   img,
        //   0,
        //   0,
        //   canvas.width * 0.3,
        //   (canvas.height * 0.3) / imgScale
        // );

        // canvas.width = 200;
        // canvas.height = 200;

        // Calculate image width and height based on original aspect ratio
        let imgWidth, imgHeight;
        const aspectRatio = img.width / img.height;
        if (aspectRatio > 1) {
          imgWidth = canvas.width * 0.5;
          imgHeight = (canvas.width * 0.5) / aspectRatio;
        } else {
          imgWidth = canvas.height * 0.5 * aspectRatio;
          imgHeight = canvas.height * 0.5;
        }

        // Draw image on canvas at top-left corner
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
        // ctx.drawImage(img, 0, 0, canvas.width, canvas.height / imgScale);

        // imageRef.current = img;
        // console.log(img);
        // setImgElement(img);
      };
      img.src = reader.result;
    };
  }

  function drawText() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(text, 50, 50);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    resetBoard(boardId);
  }

  function handleDone() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    localStorage.removeItem('boardId');
    setBoardId(null);
  }

  return (
    <div>
      {/* <canvas
        ref={imageRef}
        style={{ width: 200, height: 200, backgroundColor: '#000' }}
      /> */}
      <canvas
        ref={canvasRef}
        // onMouseDown={(e) => startDrawing(e)}
        // onMouseDown={(e) => handleMouseDown(e)}
        onMouseDown={(e) => startDragging(e)}
        // onMouseMove={(e) => {
        //   if (tool) {
        //     tool === 'draw' && draw(e);
        //     tool === 'shape' && drawShape(e);
        //   }
        // }}
        // onMouseMove={(e) => handleMouseMove(e)}
        onMouseMove={(e) => drag(e)}
        // onMouseUp={endDrawing}
        onMouseUp={endDragging}
        // onMouseOut={endDrawing}
      />
      <div>
        <div>
          <label>Tool:</label>
          <select value={tool} onChange={(e) => setTool(e.target.value)}>
            <option>---</option>
            <option value="draw">Draw</option>
            <option value="shape">Shape</option>
            <option value="image">Image</option>
            <option value="text">Text</option>
          </select>
          <input type="file" accept="image/*" onChange={(e) => drawImage(e)} />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && drawText()}
          />
        </div>

        <div>
          <label>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <label>Line Width:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
        </div>
        {/* <button onClick={handleClearCanvas}>Clear</button> */}
      </div>
      <div>
        <label>Shape:</label>
        <select value={shape || ''} onChange={(e) => setShape(e.target.value)}>
          <option>---</option>
          <option value="circle">Circle</option>
          <option value="rectangle">Rectangle</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleDone}>Done</button>
    </div>
  );
}
