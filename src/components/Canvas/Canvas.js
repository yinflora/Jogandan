import { useOnDraw } from '../../utils/Hooks/useOnDraw';

export default function Canvas({ width, height }) {
  const { setCanvasRef, onMouseDown } = useOnDraw(onDraw);
  // const setCanvasRef = useOnDraw(onDraw);

  function onDraw(ctx, point, prevPoint) {
    // ctx.fillStyle = '#000';
    // ctx.beginPath();
    // ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI); //Draw a circle
    // ctx.fill();
    drawLine(prevPoint, point, ctx, '#000', 5);
  }

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end; //如果是第一次畫start還沒定義的話則設定為end
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    //解決鋸齒
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <canvas
      width={width}
      height={height}
      onMouseDown={() => onMouseDown()}
      style={canvasStyle}
      ref={setCanvasRef}
    />
  );
}

const canvasStyle = {
  border: '1px solid black',
};
