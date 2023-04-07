import { useRef, useEffect, useState } from 'react';

export default function Canvas() {
  const [color, setColor] = useState<string>('#000');
  const [lineWidth, setLineWidth] = useState<number>(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const lineWidthRef = useRef<number>(5);
  // const colorRef = useRef<string>('#000');
  const isDrawingRef = useRef<boolean>(false);
  const startPointRef = useRef<object>({ x: 0, y: 0 });
  const lastPointRef = useRef<object>({ x: 0, y: 0 });
  const lineRef = useRef<Array>([]);
  const distanceMovedRef = useRef<number>(0);

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

  function startDrawing(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    startPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    console.log(
      `start point - x: ${startPointRef.current.x},
      y: ${startPointRef.current.y}`
    );

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
  }

  function draw(e) {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const line = lineRef.current;
    const dx = x - (line.length > 0 ? line[line.length - 1].x : x);
    const dy = y - (line.length > 0 ? line[line.length - 1].y : y);
    const distance = Math.sqrt(dx * dx + dy * dy);
    distanceMovedRef.current += distance;
    lastPointRef.current = { x: e.clientX, y: e.clientY };

    ctx.lineTo(x, y);
    ctx.stroke();

    lineRef.current = [
      ...lineRef.current,
      {
        x,
        y,
        prevX: dx,
        prevY: dy,
        color,
        lineWidth,
      },
    ];
  }

  function endDrawing() {
    isDrawingRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // const rect = canvas.getBoundingClientRect();
    // const endX = lastPointRef.current.x - rect.left;
    // const endY = lastPointRef.current.y - rect.top;

    // if (lineRef.current.length > 0 && distanceMovedRef.current >= 5) {

    // }
    lineRef.current = [];
    distanceMovedRef.current = 0;
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => startDrawing(e)}
        onMouseMove={(e) => draw(e)}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
      />
      <div>
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
        <button>Clear</button>
      </div>
      <div>
        <label>Shape:</label>
        <select
        // value={shape || ''} onChange={(e) => setShape(e.target.value)}
        >
          <option value="">Free Draw</option>
          <option value="circle">Circle</option>
          <option value="rectangle">Rectangle</option>
          <option value="triangle">Triangle</option>
          {/* <option value="move">Move</option> */}
        </select>
      </div>
    </div>
  );
}
