import { useOnDraw } from '../../utils/Hooks/useOnDraw';

export default function Canvas({ width, height }) {
  const setCanvasRef = useOnDraw(onDraw);

  function onDraw(ctx, point) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI); //Draw a circle
    ctx.fill();
  }

  return (
    <canvas
      width={width}
      height={height}
      style={canvasStyle}
      ref={setCanvasRef}
    />
  );
}

const canvasStyle = {
  border: '1px solid black',
};
