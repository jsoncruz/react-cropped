import React, { useRef } from 'react';

import { FileInput, Preview } from '../components';
import { ImperativeFileInputProps } from '../components/fileinput';

export default function Example() {
  const fileInputRef = useRef<ImperativeFileInputProps>(null);

  return (
    <>
      <Preview generic />
      <FileInput ref={fileInputRef} allowed={['jpg', 'jpeg', 'png', 'gif']}>
        <button type="button">Carregar</button>
      </FileInput>
      <button type="button" onClick={() => fileInputRef.current?.clear()}>Limpar</button>
    </>
  );
}
