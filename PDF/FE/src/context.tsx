import { createContext, useState } from "react";

export interface CInterface {
  pdf: File | null;
  setNumPages: (a: number) => void;
  numPages: number;
  setPdf: (a: File) => void; // Adjust the type to match the initial state
  selectedPages: number[];
  setSelectedPages: (a: number[]) => void;
  checkedIds: number[];
  setCheckedIds: (a: number[]) => void;
  baseURL: string;
}

var init = {
  pdf: null,
  numPages: 0,
  checkedIds: [],
};

export const myCon = createContext<CInterface | null | any>(init);

export const CProvider = ({ children }: any) => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [mypdfs, setMypdfs] = useState<string[]>([]);
  let production = false;
  let baseURL = production
    ? "https://pdf-be-rs3l.onrender.com"
    : "http://localhost:3000";
  return (
    <>
      <myCon.Provider
        value={{
          pdf,
          setNumPages,
          numPages,
          setPdf,
          selectedPages,
          setSelectedPages,
          checkedIds,
          setCheckedIds,
          mypdfs,
          setMypdfs,
          baseURL,
        }}
      >
        {children}
      </myCon.Provider>
    </>
  );
};
