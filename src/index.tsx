import React from 'react';

import ReactDOM from 'react-dom';

import ContextProvider from './context';
import Example from './example';

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <Example />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
