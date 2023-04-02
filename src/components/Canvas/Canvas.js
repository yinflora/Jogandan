import { useOnDraw } from '../../utils/Hooks/useOnDraw';

export default function Canvas({ width, height }) {
  const setCanvasRef = useOnDraw();

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
