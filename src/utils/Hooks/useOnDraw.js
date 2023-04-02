import { useRef } from 'react';

export function useOnDraw() {
  const canvasRef = useRef(null);

  function setCanvasRef(ref) {
    if (!ref) return;
    canvasRef.current = ref;
    initMouseMoveListener(); //每次建立canvasref就要開始監聽滑鼠事件
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      console.log({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', mouseMoveListener);
  }

  return setCanvasRef;
}
