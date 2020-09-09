import React, { createContext, useState } from 'react';

type Result = string | ArrayBuffer | null | undefined;

interface CroppedContextProps {
  image: Result;
  setImage: React.Dispatch<React.SetStateAction<Result>>;
}

const Context = createContext<CroppedContextProps>({} as CroppedContextProps);

const ContextProvider: React.FC = ({ children }) => {
  const [image, setImage] = useState<Result>();
  return (
    <Context.Provider value={{ image, setImage } as CroppedContextProps}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
export { Context };
