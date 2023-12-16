import express from "express";
import cors from "cors";
import multer from "multer";
import * as fs from "fs";
import { PDFDocument } from "pdf-lib";

const PORT = 3000;
const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const temp = multer({ storage });

const persistentStorage = multer.diskStorage({
  destination: "uploads/", // upload directory
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: persistentStorage });

// get all uploaded files and send file names to fe.
app.get("/uploads", async (req, res) => {
  const fileNames = await fs.promises.readdir("./uploads");
  console.log(fileNames);
  res.send(fileNames);
});

// get a spific file
app.get("/file/:name", async (req, res) => {
  let filename = req.params.name;
  const data = await fs.promises.readFile(`uploads/${filename}`);
  console.log(data.buffer);

  return res.send(new Uint8Array(data));
});

// create a new pdf with selected pages
app.post("/create-pdf", temp.single("file"), async (req, res) => {
  const file = req.file.buffer;
  const selectedPages = JSON.parse(req.body.selectedPages).map((page) =>
    parseInt(page)
  );
  try {
    if (!Buffer.isBuffer(file)) {
      throw new Error("Invalid  file");
    }
    const orginalPDF = await PDFDocument.load(file);
    console.log(req.body.selectedPages, "selectedPages");
    const newPDF = await PDFDocument.create();
    const copiedPages = await newPDF.copyPages(orginalPDF, selectedPages);

    copiedPages.forEach((copiedPage) => {
      newPDF.addPage(copiedPage);
    });
    const newPdfBuffer = await newPDF.save();
    console.log(newPdfBuffer);
    res.setHeader("Content-Type", "application/pdf");
    res.send(newPdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing PDF");
  }
});

// File upload end point
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req);
  res.send({ message: "File uploaded successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
