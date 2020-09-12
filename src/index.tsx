import React from 'react';

import ReactDOM from 'react-dom';

import CroppedContext from './context';
import Example from './example';

ReactDOM.render(
  <React.StrictMode>
    <CroppedContext>
      <Example />
    </CroppedContext>
  </React.StrictMode>,
  document.getElementById('root'),
);
