import React, { useImperativeHandle, useRef } from 'react';

interface TracerProps extends React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
  test?: number;
}

export interface ImperativeTracerProps {
  canvas: HTMLCanvasElement | null;
}

const Tracer = React.forwardRef<ImperativeTracerProps, TracerProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => ({ canvas: canvasRef.current }), []);
  return <canvas ref={canvasRef} />;
});

export default Tracer;
