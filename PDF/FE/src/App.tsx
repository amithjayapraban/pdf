import "./App.css";
import { myCon } from "./context";
import React, { useContext, useState } from "react";
import axios from "axios";
import Uploader from "./components/Uploader";
import Viewer from "./components/Viewer";
import PDFList from "./components/PDFList";

function App() {
  const { setPdf, setMypdfs, pdf, mypdfs, baseURL, setCheckedIds } =
    useContext(myCon);
  const [menuShown, setMenuShown] = useState(false);
  // shows the menu
  function showUploadMenu() {
    setMenuShown(true);
    if(!pdf)alert("Please load the PDF")
    document.getElementById("upload_menu")?.classList.remove("w0");
    document.getElementById("upload_menu")?.classList.add("w100");
  }
  // hides menu when bg is clicked
  function bgClick(e: any) {
    let menu = document.getElementById("upload_menu");
    if (!(e.target == menu) && menuShown) {
      document.getElementById("upload_menu")?.classList.remove("w100");
      document.getElementById("upload_menu")?.classList.add("w0");
      setMenuShown(false);
    } else {
      document.getElementById("upload_btn")?.classList.remove("hidden");
    }
  }
  // fetches names of all uploaded files
  const fetchUploads = async () => {
    try {
      const response = await axios.get(`${baseURL}/uploads`);
      if (response.data.length > 0) {
        console.log(response.data);
        setMypdfs(response.data);
      } else {
        alert("No uploaded files found.");
      }
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };
  //handles file change
  const handleFileChange = (e: any) => {
    console.log(e.target.files);
    const selectedFile = e.target.files?.[0];
    setCheckedIds([]);
    if (selectedFile) {
      setPdf(selectedFile);
    }
  };

  return (
    <div
      onClick={bgClick}
      className="App  h-[100dvh] cursor-default relative p-3 gap-3 overflow-hidden items-center justify-center flex flex-col "
    >
      <section className="absolute flex flex-col gap-3   z-[100] right-3 md:right-12">
        <button
          onClick={showUploadMenu}
          id="upload_btn"
          className=" flex items-center justify-center rounded-full aspect-square    bg-gray-500 "
        >
          <img src="./assets/upload.svg" alt="upload file" />
        </button>

        <button
          onClick={() => document.getElementById("pdf_upload")?.click()}
          id="openPdf_btn"
          className="relative flex items-center justify-center rounded-full aspect-square    bg-gray-500 "
        >
          <img src="./assets/file.svg" alt="load file" />
          <input
            className="absolute hidden"
            id="pdf_upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />
        </button>

        <button
          onClick={fetchUploads}
          id="fetchuploads_btn"
          className=" flex items-center justify-center rounded-full aspect-square    bg-gray-500 "
        >
          <img src="./assets/download.svg" alt="fetch uploads" />
        </button>
      </section>
      {pdf && <Uploader />}
      <Viewer />
      {mypdfs.length > 0 && <PDFList />}
    </div>
  );
}

export default App;
