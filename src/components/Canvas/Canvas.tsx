import { useRef, useEffect, useState } from 'react';
import {
  createBoard,
  updateLines,
  updateShapes,
  resetBoard,
  getBoard,
  deleteSelectedShapes,
} from '../../utils/firebase';

export default function Canvas() {
  const [tool, setTool] = useState<string | null>(null);
  const [color, setColor] = useState<string>('#000');
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [shape, setShape] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [boardId, setBoardId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const startPointRef = useRef<object>({ x: 0, y: 0 });
  const lastPointRef = useRef<object>({ x: 0, y: 0 });
  const lineRef = useRef<object[]>([]);
  const shapeRef = useRef<object | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const isSelectedRef = useRef<boolean>(false);
  const selectedRef = useRef<object | null>(null);

  const BACKGROUND_COLOR: string = 'gray';

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

    const type = selectedRef.current.type;
    // console.log(type);

    //邊移動邊清畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //假設是要移動長方形
    const rectWidth = selectedRef.current.endX - selectedRef.current.startX;
    const rectHeight = selectedRef.current.endY - selectedRef.current.startY;
    console.log(rectWidth, rectHeight);

    const circleBaseX = selectedRef.current.endX - selectedRef.current.startX;
    const circleBaseY = selectedRef.current.endY - selectedRef.current.startY;

    const radius = Math.sqrt(
      Math.pow(circleBaseX, 2) + Math.pow(circleBaseY, 2)
    );
    //形狀顏色
    ctx.fillStyle = selectedRef.current.color;
    ctx.lineWidth = selectedRef.current.lineWidth;

    switch (type) {
      case 'circle':
        console.log('Hi我是圓形');
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'rectangle':
        console.log('Hi我是方形');
        ctx.beginPath();
        ctx.rect(x, y, rectWidth, rectHeight);
        ctx.fill();
        break;
      case 'triangle':
        console.log('Hi我是三角形');
        ctx.beginPath();
        ctx.moveTo(
          x,
          y - Math.abs(selectedRef.current.endY - selectedRef.current.startY)
        );
        ctx.lineTo(
          x -
            Math.abs(selectedRef.current.endX - selectedRef.current.startX) / 2,
          y + Math.abs(selectedRef.current.endY - selectedRef.current.startY)
        );
        ctx.lineTo(
          x +
            Math.abs(selectedRef.current.endX - selectedRef.current.startX) / 2,
          y + Math.abs(selectedRef.current.endY - selectedRef.current.startY)
        );
        ctx.closePath();
        ctx.fill();
        break;
      default:
        break;
    }

    // const rect = canvas.getBoundingClientRect();
    // startPointRef.current = { x, y };

    // lastPointRef.current = { x: e.clientX, y: e.clientY };
    // startPointRef.current = { x: e.clientX, y: e.clientY };
  }

  function endDragging(e) {
    isDraggingRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // const endX = lastPointRef.current.x - rect.left;
    // const endY = lastPointRef.current.y - rect.top;
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    // shapeRef.current = {
    //   type: shape,
    //   startX: startPointRef.current.x,
    //   startY: startPointRef.current.y,
    //   endX,
    //   endY,
    //   color,
    //   lineWidth,
    // }; //Todo

    selectedRef.current = {
      ...selectedRef.current,
      startX,
      startY,
      endX: startX + selectedRef.current.endX - selectedRef.current.startX,
      endY: startY + selectedRef.current.endY - selectedRef.current.startY,
    };
    updateShapes(boardId, selectedRef.current);
    console.log(selectedRef.current);
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
        selectedRef.current = shape;
        isTarget = true;
        deleteSelectedShapes(boardId, shape);
        break;
      }
    }

    console.log(selectedRef.current);
    console.log(isTarget);
    return isTarget;
  }

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

    canvas.width = 1000;
    canvas.height = 500;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidth;

    ctx.fillStyle = BACKGROUND_COLOR;
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

    shapeRef.current = {
      type: shape,
      startX: startPointRef.current.x,
      startY: startPointRef.current.y,
      endX,
      endY,
      color,
      lineWidth,
    };

    switch (tool) {
      case 'draw':
        isDrawingRef.current === false &&
          lineRef.current.length > 0 &&
          updateLines(boardId, lineRef.current);
        lineRef.current = [];
        break;
      case 'shape':
        isDrawingRef.current === false &&
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
        let imgWidth, imgHeight;
        const aspectRatio = img.width / img.height;
        if (aspectRatio > 1) {
          imgWidth = canvas.width * 0.5;
          imgHeight = (canvas.width * 0.5) / aspectRatio;
        } else {
          imgWidth = canvas.height * 0.5 * aspectRatio;
          imgHeight = canvas.height * 0.5;
        }

        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
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

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    resetBoard(boardId);
  }

  function handleDone() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    localStorage.removeItem('boardId');
    setBoardId(null);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        // onMouseDown={(e) => startDrawing(e)}
        onMouseDown={(e) => startDragging(e)}
        // onMouseMove={(e) => {
        //   if (tool) {
        //     tool === 'draw' && draw(e);
        //     tool === 'shape' && drawShape(e);
        //   }
        // }}
        onMouseMove={(e) => drag(e)}
        // onMouseUp={endDrawing}
        onMouseUp={endDragging}
      />
      <div>
        <div>
          <label>Tool:</label>
          <select value={tool} onChange={(e) => setTool(e.target.value)}>
            <option>---</option>
            <option value="draw">Draw</option>
            <option value="shape">Shape</option>
            {/* <option value="image">Image</option>
            <option value="text">Text</option> */}
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
