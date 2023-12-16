import React, { useCallback, useContext, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { CInterface, myCon } from "../context";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import axios from "axios";
import InitialScreen from "./InitialScreen";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
const resizeObserverOptions = {};

const Viewer = () => {
  const { pdf, setNumPages, numPages, baseURL, setCheckedIds, checkedIds } =
    useContext(myCon);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1);
  const [scale, setScale] = useState(1.25);
  console.log(checkedIds, "checkedIds");

  const handleCheckboxChange = (event: any) => {
    const checkboxId = event.target.id;
    if (event.target.checked) {
      setCheckedIds((prevCheckedIds: any) => [...prevCheckedIds, checkboxId]);
    } else {
      setCheckedIds((prevCheckedIds: any) =>
        prevCheckedIds.filter((id: any) => id !== checkboxId)
      );
    }
  };

  // create a new pdf with selectd pages
  const handleCreatePDF = async () => {
    const formData = new FormData();
    formData.append("file", pdf);
    if (checkedIds.length < 1) {
      alert("Select pages to create new PDF");
      throw new Error("Selected pages 0");
    }
    formData.append("selectedPages", JSON.stringify(checkedIds));
    try {
      const response = await axios.post(`${baseURL}/create-pdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        const data = await response.data;
        console.log(response);
        const byteArray = new Uint8Array(Object.keys(response.data).length);
        for (const [index, value] of Object.entries(response.data)) {
          const numericIndex: number = Number(index);
          const val: number = typeof value === "number" ? value : 0;
          byteArray[numericIndex] = val;
        }
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "newPdfFile.pdf"; 
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return pdf ? (
    <>
      <div
        className="flex flex-col w-full  gap-6 items-center justify-center"
        ref={setContainerRef}
      >
        <Document
          className="shadow-xl  rounded-xl overflow-x-hidden doc flex flex-col overflow-scroll h-[86dvh] "
          file={pdf}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div className="flex relative">
              <label>
                <input
                  onChange={handleCheckboxChange}
                  id={`${index}`}
                  type="checkbox"
                  className="w-4 h-4 md:h-6 md:w-6 top-2 right-2 absolute z-[8]"
                />
                <Page
                  className="border-b"
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                  width={containerWidth / 1.5}
                />
              </label>
            </div>
          ))}
        </Document>

        <div className="flex gap-2 w-full  justify-center items-center">
          <button
            className="p-2 text-white rounded-full text-sm bg-gray-500"
            onClick={() => {
              setScale(Math.min(scale + 0.25, 1.5));
            }}
          >
            <svg
              className="w-5"
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m15.97 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007zm-.744 6.26h-2.5c-.414 0-.75.336-.75.75s.336.75.75.75h2.5v2.5c0 .414.336.75.75.75s.75-.336.75-.75v-2.5h2.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-2.5v-2.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
                fill-rule="nonzero"
                fill="white"
              />
            </svg>
          </button>

          <button
            className=" p-2 text-white rounded-full text-sm bg-gray-500"
            onClick={() => {
              setScale(Math.max(scale - 0.25, 0.5));
            }}
          >
            <svg
              className="w-5"
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m15.97 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007zm3.256 6.26h-6.5c-.414 0-.75.336-.75.75s.336.75.75.75h6.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"
                fill-rule="nonzero"
                fill="white"
              />
            </svg>
          </button>

          <p className="text-xs p-2 text-center w-[8rem] text-gray-500 rounded-lg">
            {" "}
            {checkedIds.length} Pages Selected
          </p>
          <button
            onClick={handleCreatePDF}
            className="p-2 px-3 text-xs text-white rounded-lg  bg-green-400"
          >
            <small className="leading-[.5px]"> Create PDF</small>
          </button>
        </div>
      </div>
    </>
  ) : (
    <InitialScreen />
  );
};

export default Viewer;
