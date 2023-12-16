import axios from "axios";
import React, { useState, ChangeEvent, useContext } from "react";
import { myCon } from "../context";
//uploader menu
const Uploader = () => {
  const { pdf, baseURL } = useContext(myCon);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", pdf);
    try {
      const response = await axios.post(`${baseURL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      alert("File Upload Success.");
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  return (
    <form
      id="upload_menu"
      className="flex mb-[3.5rem]  overflow-hidden text-gray-500 w0  flex-col  absolute  right-3  md:right-12 z-[150] rounded-lg  justify-center items-start gap-2 shadow-2xl bg-white opacity- 30 border p-6"
      onSubmit={handleUpload}
    >
      {" "}
      <p>
        Upload <i>{pdf.name}</i> ?
      </p>
      <button
        className="p-1 px-3 self-end text-white rounded-lg text-sm bg-gray-500"
        type="submit"
      >
        Continue
      </button>
    </form>
  );
};

export default Uploader;
