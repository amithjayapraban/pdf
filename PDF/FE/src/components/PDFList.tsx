import { useContext, useEffect } from "react";
import { myCon } from "../context";
import axios from "axios";

export default function PDFList() {
  const { mypdfs, setMypdfs, setPdf, baseURL } = useContext(myCon);

  useEffect(() => {
    document.getElementById("pdf_list")?.classList.remove("hidden");
  });

  // fetch a pdf to display
  const fetchPDF = (name: string) => {
    axios
      .get(`${baseURL}/file/${name.toString()}`)
      .then((response) => {
        console.log(response.data);
        const valuesArray: any = Object.values(response.data);
        const uint8Array = new Uint8Array(valuesArray);
        const blob = new Blob([uint8Array], { type: "application/pdf" });
        console.log(blob);
        setPdf(blob);
        document.getElementById("pdf_list")?.classList.add("hidden");
        setMypdfs([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div
      id="pdf_list"
      className="absolute hidden flex flex-col text-gray-500  items-center bg-white shadow-2xl z-[300] rounded-xl md:w-[50%] w-[80%]   "
    >
      <span className=" italic bg-gray-500 text-white    flex  items-center justify-end  rounded-t-xl w-full">
        <img
          onClick={() => {
            document.getElementById("pdf_list")?.classList.add("hidden");
            setMypdfs([]);
          }}
          src="./assets/close.svg"
          className="cursor-pointer"
          alt="close"
        />
      </span>
      <p className="italic  text-xs px-6 py-2 bg-gray-100  w-full text-gray-500">
        /uploads
      </p>
      <div className="flex w-full flex-col min-h-[40dvh] px-3 rounded  max-h-[60dvh]  text-xs  overflow-scroll text-sm items-start ">
        {mypdfs &&
          mypdfs.map((name: string,index:any) => {
            return (
              <button key={index}
                onClick={() => {
                  fetchPDF(name);
                }}
                className="w-full hover:text-gray-800  p-2 pt-4 pb-1 border-b text-left"
              >
                {name.split("-")[1]}
              </button>
            );
          })}
      </div>
    </div>
  );
}
