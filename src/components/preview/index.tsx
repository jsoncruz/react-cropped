import React, { useContext } from 'react';

import { Context } from '../../context';

interface PreviewProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  generic?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ style, generic, ...props }) => {
  const { image } = useContext(Context);

  let preview: React.CSSProperties | undefined = style;

  if (generic) {
    preview = {
      border: '1px solid #abacb0',
      backgroundColor: '#c7cad3',
      display: 'block',
      height: 200,
      width: 200,
      ...style,
    };
    if (!image) {
      props.src = require('./generic.svg');
    }
  }

  if (image) {
    props.src = image as string;
  }

  return (
    <img alt="Preview" style={preview} {...props} />
  );
};

export default Preview;
