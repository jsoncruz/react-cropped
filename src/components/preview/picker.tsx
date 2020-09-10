import React, {
  useImperativeHandle,
  useLayoutEffect,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';

import { Context } from '../../context';
import { PickerArea } from './style';

export type MouseHandling = ((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void);
export type MouseFocusal = ((event: React.FocusEvent<HTMLImageElement>) => void);

export interface PickerInitialCoordsProps {
  startX: number;
  startY: number;
  relativeStartX: number;
  relativeStartY: number;
}

export interface PickerFinalCoordsProps {
  endX: number;
  endY: number;
  relativeEndX: number;
  relativeEndY: number;
}

interface PickerProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  parent: HTMLImageElement | null;
  initial: PickerInitialCoordsProps | undefined;
  final: PickerFinalCoordsProps | undefined;
  isInteractivityEnabled: boolean;
}

export interface ImperativePickerProps {
  picker: HTMLDivElement | null;
  clear(): void;
}

interface DraggingLimits {
  vertical: { from: number; to: number; };
  horizontal: { from: number; to: number; };
}

const Picker = React.forwardRef<ImperativePickerProps, PickerProps>(({ initial, final, ...props }, ref) => {
  const { image } = useContext(Context);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [draggingLimits, setDraggingLimits] = useState<DraggingLimits>();

  useMemo(() => {
    if (props.isInteractivityEnabled) {
      if (pickerRef.current) {
        pickerRef.current.style.display = 'initial';
        const { current: section } = pickerRef;
        if (initial) {
          section.style.top = `${initial.startY}px`;
          section.style.left = `${initial.startX}px`;
          if (final) {
            let { width, height } = {
              width: final.endX - initial.startX,
              height: final.endY - initial.startY,
            };
            if (width < 0) {
              section.style.left = `${((width * -1) - initial.startX) * -1}px`;
              width = width < 0 ? width * -1 : width;
            }
            if (height < 0) {
              section.style.top = `${((height * -1) - initial.startY) * -1}px`;
              height = height < 0 ? height * -1 : height;
            }
            section.style.width = `${width}px`;
            section.style.height = `${height}px`;
          }
        }
      }
    }
  }, [props.isInteractivityEnabled, initial, final]);

  const handleReset = useCallback(() => {
    if (pickerRef.current) {
      pickerRef.current.removeAttribute('style');
    }
  }, []);

  const handleMouseDown = useCallback<MouseHandling>(() => {
    if (pickerRef.current) {
      pickerRef.current.style.cursor = 'grabbing';
    }
  }, []);
  const handleMouseMove = useCallback<MouseHandling>(({ nativeEvent }) => {
    if (pickerRef.current) {
      //
    }
  }, []);
  const handleMouseLeave = useCallback<MouseHandling>(() => {
    if (pickerRef.current) {
      pickerRef.current.style.cursor = 'grab';
    }
  }, []);

  useLayoutEffect(() => {
    if (props.parent) {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = props.parent;
      setDraggingLimits({
        vertical: { from: offsetTop, to: offsetHeight },
        horizontal: { from: offsetLeft, to: offsetWidth },
      });
    }
  }, [props.parent]);

  useEffect(() => {
    if (pickerRef.current) {
      if (pickerRef.current.hasAttribute('style')) {
        if (image) {
          const isDragging = props.isInteractivityEnabled === false;
          pickerRef.current.style.pointerEvents = isDragging ? 'auto' : 'none';
          pickerRef.current.style.cursor = isDragging ? 'grab' : 'default';
        }
        if (image === null) {
          handleReset();
        }
      }
    }
  }, [handleReset, image, props.isInteractivityEnabled]);

  useImperativeHandle(ref, () => ({
    picker: pickerRef.current,
    clear: () => handleReset(),
  }), [handleReset]);

  return (
    <PickerArea
      {...props}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={pickerRef}
    />
  );
});

export default Picker;
