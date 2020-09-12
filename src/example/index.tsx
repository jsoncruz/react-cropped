import React, { useCallback, useRef } from 'react';

import { FileInput, Preview } from '../components';
import { ImperativeFileInputProps } from '../components/fileinput';
import { ImperativePreviewProps } from '../components/preview/index';

export default function Example() {
  const fileInputRef = useRef<ImperativeFileInputProps>(null);
  const previewRef = useRef<ImperativePreviewProps>(null);

  const handleCrop = useCallback(() => {
    if (previewRef.current) {
      previewRef.current.crop();
    }
  }, []);

  const handleClear = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.clear();
    }
  }, []);

  return (
    <>
      <Preview ref={previewRef} generic />
      <FileInput ref={fileInputRef} allowed={['jpg', 'jpeg', 'png', 'gif']}>
        <button type="button">Carregar</button>
      </FileInput>
      <button type="button" onClick={handleCrop}>Cortar</button>
      <button type="button" onClick={handleClear}>Limpar</button>
    </>
  );
}
