import React, { createContext, useState } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type LoadingContextProviderProps = {
  children: React.ReactNode;
};

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
});

export const LoadingContextProvider = ({
  children,
}: LoadingContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
