import React, {
  useImperativeHandle,
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
  isPicked: boolean;
}

const Picker = React.forwardRef<ImperativePickerProps, PickerProps>(({ initial, final, ...props }, ref) => {
  const { image } = useContext(Context);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setDragging] = useState(false);
  const [rectBounding, setRectBounding] = useState<DOMRect>();
  const [initialMovementOffset, setInitialMovementOffset] = useState<Array<number>>();

  const { isInteractivityEnabled } = props;

  useMemo(() => {
    if (isInteractivityEnabled) {
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
  }, [isInteractivityEnabled, initial, final]);

  const handleReset = useCallback(() => {
    if (pickerRef.current) {
      pickerRef.current.removeAttribute('style');
      setDragging(false);
      setRectBounding(undefined);
      setInitialMovementOffset(undefined);
    }
  }, []);

  const handleMouseDown = useCallback<MouseHandling>(({ clientX, clientY }) => {
    if (pickerRef.current) {
      pickerRef.current.style.cursor = 'grabbing';
      setInitialMovementOffset([
        pickerRef.current.offsetLeft - clientX,
        pickerRef.current.offsetTop - clientY,
      ]);
      setDragging(true);
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    if (pickerRef.current && isInteractivityEnabled === false) {
      pickerRef.current.style.cursor = 'grab';
      setDragging(false);
    }
  }, [isInteractivityEnabled]);

  const handleMouseMove = useCallback<MouseHandling>(({ clientX, clientY, currentTarget }) => {
    if (pickerRef.current && isInteractivityEnabled === false && isDragging) {
      if (rectBounding && initialMovementOffset) {
        const { x, y, width, height } = currentTarget.getBoundingClientRect();
        // const horizontal = x > rectBounding.left && x < (rectBounding.width - width);
        // const vertical = y > rectBounding.top && y < (rectBounding.height - height);
        pickerRef.current.style.left = `${clientX + initialMovementOffset[0]}px`;
        pickerRef.current.style.top = `${clientY + initialMovementOffset[1]}px`;
      }
    }
  }, [initialMovementOffset, isDragging, isInteractivityEnabled, rectBounding]);

  useEffect(() => {
    if (pickerRef.current) {
      if (pickerRef.current.hasAttribute('style')) {
        if (image) {
          pickerRef.current.style.pointerEvents = rectBounding ? 'auto' : 'none';
          pickerRef.current.style.cursor = rectBounding ? 'grab' : 'default';
        }
        if (image === null) {
          handleReset();
        }
      }
    }
  }, [handleReset, image, rectBounding]);

  useMemo(() => {
    if (props.parent && isInteractivityEnabled === false) {
      setRectBounding(props.parent.getBoundingClientRect());
    }
  }, [isInteractivityEnabled, props.parent]);

  useImperativeHandle(ref, () => ({
    picker: pickerRef.current,
    clear: () => handleReset(),
    isPicked: !!rectBounding,
  }), [handleReset, rectBounding]);

  return (
    <PickerArea
      {...props}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseOut}
      onMouseUp={handleMouseOut}
      ref={pickerRef}
    />
  );
});

export default Picker;
