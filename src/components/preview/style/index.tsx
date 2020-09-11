import React from 'react';

import styled from 'styled-components';

const styles: Record<string, React.CSSProperties> = {
  generic: {
    objectFit: 'contain',
    border: '1px solid #abacb0',
    backgroundColor: '#c7cad3',
    display: 'block',
    height: 300,
    width: 300,
  },
};

const Image = styled.img`
  user-select: none;
  -o-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
`;

const PickerArea = styled.div`
  display: none;
  position: fixed;
  border: 2px dashed #fff;
  box-shadow: 0 0 1px 0px rgba(0,0,0,1);
  pointer-events: none;
  z-index: 999;
`;

export { Image, PickerArea, styles };
