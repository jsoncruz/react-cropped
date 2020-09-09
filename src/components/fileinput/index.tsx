import React, { useRef, useContext, useImperativeHandle, useCallback } from 'react';

import { Context } from '../../context';
import Input from './style';

type ChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => void | undefined;

export interface FileInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
  allowed?: Array<string>;
}

export interface ImperativeFileInputProps {
  container: HTMLDivElement | null;
  input: HTMLInputElement | null;
  clear(): void;
}

const FileInput = React.forwardRef<ImperativeFileInputProps, FileInputProps>(({ width, height, children, ...props }, ref) => {
  const { setImage } = useContext(Context);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    if (props.disabled !== true) {
      if (inputRef.current) {
        inputRef.current.click();
      }
    }
  }, [props.disabled]);

  const handleReset = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setImage(null);
    }
  }, [setImage]);

  const handleInputChange = useCallback<ChangeEvent>(({ target: { files } }) => {
    const translate = (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ({ target }) => setImage(target?.result);
    };
    if (files?.length) {
      const file = files[0];
      if (props.allowed) {
        const overload = props.allowed.filter((format) => {
          const re = new RegExp(format, 'i');
          return re.test(file.type);
        });
        if (overload.length) {
          translate(file);
        } else {
          handleReset();
        }
      } else {
        translate(file);
      }
    }
  }, [handleReset, props.allowed, setImage]);

  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    input: inputRef.current,
    clear: () => handleReset(),
  }), [handleReset]);

  const view: React.CSSProperties = {
    width: width ?? 'fit-content',
    height: height ?? 'fit-content',
    ...props.style,
  };

  return (
    <div ref={containerRef} style={view} onClick={handleClick} aria-hidden="true">
      <Input {...props} ref={inputRef} type="file" onChange={handleInputChange} />
      {children}
    </div>
  );
});

export default FileInput;
