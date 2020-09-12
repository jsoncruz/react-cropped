import React, {
  useImperativeHandle,
  useCallback,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

import { Context } from '../../context';
import Picker, {
  PickerInitialCoordsProps,
  PickerFinalCoordsProps,
  ImperativePickerProps,
  MouseHandling,
} from './picker';
import { Img, styles } from './style';
import Tracer, { ImperativeTracerProps } from './tracer';

interface PreviewProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  generic?: boolean;
}
export interface ImperativePreviewProps {
  img: HTMLImageElement | null;
  crop(): void;
}

const Preview = React.forwardRef<ImperativePreviewProps, PreviewProps>(({ generic, ...props }, ref) => {
  const { image } = useContext(Context);

  const imgRef = useRef<HTMLImageElement>(null);
  const pickerRef = useRef<ImperativePickerProps>(null);
  const tracerRef = useRef<ImperativeTracerProps>(null);

  const [interactivity, setInteractivity] = useState(false);
  const [initialCoords, setInitialCoords] = useState<PickerInitialCoordsProps>();
  const [finalCoords, setFinalCoords] = useState<PickerFinalCoordsProps>();

  const handleMouseOver = useCallback<MouseHandling>(({ currentTarget }) => {
    currentTarget.style.cursor = image ? 'crosshair' : 'default';
  }, [image]);

  const handleMouseDown = useCallback<MouseHandling>(({ clientX, clientY, screenX, screenY }) => {
    if (image) {
      if (pickerRef.current) {
        if (pickerRef.current.isPicked) {
          setInitialCoords(undefined);
          setFinalCoords(undefined);
          pickerRef.current.clear();
        }
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

  const handleCrop = useCallback(() => {
    if (pickerRef.current) {
      if (imgRef.current && pickerRef.current.isPicked) {
        if (pickerRef.current.picker && initialCoords) {
          const { width: imgWidth, height: imgHeight } = imgRef.current;
          const { width: pickerWidth, height: pickerHeight } = pickerRef.current.picker.style;

          const [pickedWidth, pickedHeight] = [
            parseInt(pickerWidth, 10),
            parseInt(pickerHeight, 10),
          ];

          const [factorWidth, factorHeight] = [
            +(pickedWidth / imgWidth),
            +(pickedHeight / imgHeight),
          ];

          const [croppedWidth, croppedHeight] = [
            (factorWidth * imgWidth),
            (factorHeight * imgHeight),
          ];

          const [currentX, currentY] = [
            +(initialCoords.relativeStartX * factorWidth),
            +(initialCoords.relativeStartY * factorHeight),
          ];

          if (tracerRef.current) {
            if (tracerRef.current.canvas && tracerRef.current.context) {
              const { current: { context, canvas } } = tracerRef;
              const croppedImage = context.getImageData(currentX, currentY, croppedWidth, croppedHeight);

              context.clearRect(0, 0, context.canvas.width, context.canvas.height);

              canvas.width = croppedWidth;
              canvas.height = croppedHeight;

              imgRef.current.width = croppedWidth;
              imgRef.current.height = croppedHeight;

              context.putImageData(croppedImage, 0, 0);

              pickerRef.current.clear();

              imgRef.current.src = canvas.toDataURL();
            }
          }
        }
      }
    }
  }, [initialCoords]);

  useEffect(() => {
    const { current: tracer } = tracerRef;
    const { current: img } = imgRef;
    if (tracer && img) {
      if (image) {
        const { canvas, context } = tracer;
        if (canvas && context) {
          const { width, height } = img;
          const temp = new Image(width, height);
          temp.onload = () => {
            canvas.width = width;
            canvas.height = height;
            context.clearRect(0, 0, width, height);
            context.drawImage(temp, 0, 0, width, height);
            if (img) {
              img.src = canvas.toDataURL();
            }
          };
          temp.src = String(image);
        }
      } else if (generic && !image) {
        img.src = require('./asset/generic.svg');
      }
    }
  }, [generic, image]);

  useImperativeHandle(ref, () => ({
    img: imgRef.current,
    crop: handleCrop,
  }), [handleCrop]);

  return (
    <>
      <Img
        draggable="false"
        alt="preview"
        {...props}
        style={{ ...generic && styles.generic, ...props.style }}
        ref={imgRef}
        onMouseOver={handleMouseOver}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseOut}
        onMouseUp={handleMouseOut}
        onFocus={() => { /**/ }}
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
