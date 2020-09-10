import React, {
  useState,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useMemo,
} from 'react';

import { Context } from '../../context';
import Picker, {
  PickerInitialCoordsProps,
  PickerFinalCoordsProps,
  ImperativePickerProps,
  MouseHandling,
  MouseFocusal,
} from './picker';
import { Image, styles } from './style';
import Tracer, { ImperativeTracerProps } from './tracer';

interface PreviewProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  generic?: boolean;
}
export interface ImperativePreviewProps {
  img: HTMLImageElement | null;
}

const Preview = React.forwardRef<ImperativePreviewProps, PreviewProps>(({ generic, ...props }, ref) => {
  const { image } = useContext(Context);

  const imgRef = useRef<HTMLImageElement>(null);
  const pickerRef = useRef<ImperativePickerProps>(null);
  const tracerRef = useRef<ImperativeTracerProps>(null);

  const [interactivity, setInteractivity] = useState(false);
  const [initialCoords, setInitialCoords] = useState<PickerInitialCoordsProps>();
  const [finalCoords, setFinalCoords] = useState<PickerFinalCoordsProps>();

  useImperativeHandle(ref, () => ({ img: imgRef.current }), []);

  const handleMouseOver = useCallback<MouseHandling>(({ currentTarget }) => {
    currentTarget.style.cursor = image ? 'crosshair' : 'default';
  }, [image]);

  const handleMouseDown = useCallback<MouseHandling>(({ clientX, clientY, screenX, screenY }) => {
    if (image) {
      if (pickerRef.current?.isPicked) {
        setInitialCoords(undefined);
        setFinalCoords(undefined);
        pickerRef.current.clear();
      }
      setInteractivity(true);
      setInitialCoords({
        startX: clientX,
        startY: clientY,
        relativeStartX: screenX,
        relativeStartY: screenY,
      });
    }
  }, [image]);

  const handleMouseMove = useCallback<MouseHandling>(({ clientX, clientY, screenX, screenY }) => {
    if (interactivity) {
      setFinalCoords({
        endX: clientX,
        endY: clientY,
        relativeEndX: screenX,
        relativeEndY: screenY,
      });
    }
  }, [interactivity]);

  const handleMouseOut = useCallback<MouseHandling>(({ clientX, clientY, screenX, screenY }) => {
    if (interactivity) {
      setInteractivity(false);
      setFinalCoords({
        endX: clientX,
        endY: clientY,
        relativeEndX: screenX,
        relativeEndY: screenY,
      });
    }
  }, [interactivity]);

  const handleMouseFocus = useCallback<MouseFocusal>(() => console.log('focused'), []);

  useMemo(() => {
    if (image) {
      props.src = image as string;
    }
  }, [image, props]);

  if (generic) {
    props.style = { ...styles.generic, ...props.style };
    if (!image) {
      props.src = require('./asset/generic.svg');
    }
  }

  return (
    <>
      <Image
        draggable="false"
        alt="Preview"
        {...props}
        ref={imgRef}
        onMouseOver={handleMouseOver}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseOut}
        onMouseUp={handleMouseOut}
        onFocus={handleMouseFocus}
        role="presentation"
      />
      <Picker
        ref={pickerRef}
        parent={imgRef.current}
        isInteractivityEnabled={interactivity}
        initial={initialCoords}
        final={finalCoords}
      />
      <Tracer ref={tracerRef} />
    </>
  );
});

export default Preview;
