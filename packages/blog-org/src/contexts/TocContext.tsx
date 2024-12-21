import { initialTocState } from "@/reducers/toc/initialTocState";
import { tocReducer } from "@/reducers/toc/tocReducer";
import { TocContextType } from "Components";
import React, { FC, createContext, useContext, useReducer } from "react";

const TocContext = createContext<TocContextType>({
  tocState: initialTocState,
  tocDispatch: () => undefined,
});

const TocProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [tocState, tocDispatch] = useReducer(tocReducer, initialTocState);

  return (
    <TocContext.Provider value={{ tocState, tocDispatch }}>
      {children}
    </TocContext.Provider>
  );
};

export const useToc = () => useContext(TocContext);

export default TocProvider;
