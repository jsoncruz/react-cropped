import React, { useImperativeHandle, useRef } from 'react';

type TracerProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;

export interface ImperativeTracerProps {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
}

const Tracer = React.forwardRef<ImperativeTracerProps, TracerProps>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    canvas: canvasRef.current,
    context: canvasRef.current?.getContext('2d') ?? null,
  }), []);

  return (
    <canvas
      {...props}
      ref={canvasRef}
      style={{ display: 'none' }}
    />
  );
});

export default Tracer;
