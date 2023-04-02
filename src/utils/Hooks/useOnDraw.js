import { useEffect, useRef } from 'react';

export function useOnDraw(onDraw) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const mouseMoveListenerRef = useRef(null);
  const mouseDownListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener('mousemove', mouseMoveListenerRef.current);
      }
      if (mouseUpListenerRef.current) {
        window.removeEventListener('mouseup', mouseUpListenerRef.current);
      }
    };
  }, []);

  function setCanvasRef(ref) {
    if (!ref) return;
    if (canvasRef.current) {
      canvasRef.current.removeEventListener(
        'mousedown',
        mouseDownListenerRef.current
      ); //每次建立新的canvasRef前要清除前一次的監聽器
    }
    canvasRef.current = ref;
    initMouseMoveListener(); //每次建立canvasRef就要開始監聽滑鼠事件
    initMouseDownListener(); //用戶要在canvas按下左鍵才能開始畫
    initMouseUpListener(); //用戶放開滑鼠時停止作畫
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      if (isDrawingRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY);
        const ctx = canvasRef.current.getContext('2d');
        if (onDraw) onDraw(ctx, point);
        console.log(point);
      }
    };
    mouseMoveListenerRef.current = mouseMoveListener; //用於clean up
    window.addEventListener('mousemove', mouseMoveListener);
  }

  function initMouseUpListener() {
    const mouseUpListener = () => {
      isDrawingRef.current = false;
    };
    mouseUpListenerRef.current = mouseUpListener; //用於clean up
    window.addEventListener('mouseup', mouseUpListener); //在canvas外放開滑鼠也要視為停止作畫，所以將監聽器裝在window
  }

  function initMouseDownListener() {
    if (!canvasRef.current) return;
    const mouseDownListener = () => {
      isDrawingRef.current = true;
    };
    mouseDownListenerRef.current = mouseDownListener; //用於clean up
    canvasRef.current.addEventListener('mousedown', mouseDownListener);
  }

  function computePointInCanvas(clientX, clientY) {
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
      };
    }
    return null;
  }

  return setCanvasRef;
}
