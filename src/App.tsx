import React, { useEffect, useRef } from 'react';

import { FileInput, Preview } from './components';
import { ImperativeFileInputProps } from './components/fileinput';

export default function App() {
  const fileInputRef = useRef<ImperativeFileInputProps>(null);

  useEffect(() => {
    console.log(fileInputRef.current);
  }, [fileInputRef]);

  return (
    <>
      <Preview generic />
      <FileInput ref={fileInputRef} allowed={['jpg', 'png', 'gif']}>
        <button type="button">Carregar</button>
      </FileInput>
      <button type="button" onClick={() => fileInputRef.current?.clear()}>Limpar</button>
    </>
  );
}
