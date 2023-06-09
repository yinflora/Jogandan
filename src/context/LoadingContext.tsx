import React, { createContext, useState } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
type LoadingContextProviderPropType = {
  children: React.ReactNode;
};

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  // eslint-disable-next-line no-empty-function
  setIsLoading: () => {},
});

export const LoadingContextProvider = ({
  children,
}: LoadingContextProviderPropType) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
