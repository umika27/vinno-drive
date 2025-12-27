const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const File = require("../models/File");

const router = express.Router();

// temp folder for uploads
const upload = multer({ dest: "temp/" });

console.log("Upload route loaded");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    // read file buffer
    const fileBuffer = fs.readFileSync(file.path);

    // create hash
    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    // check if file exists
    const existingFile = await File.findOne({ hash });

    if (existingFile) {
      existingFile.referenceCount += 1;
      await existingFile.save();

      // delete temp file
      fs.unlinkSync(file.path);

      return res.json({
        message: "Duplicate file detected. Reference created.",
        hash
      });
    }

    // move file to storage
    const storagePath = path.join("server/storage", hash);
    fs.renameSync(file.path, storagePath);

    await File.create({
      filename: file.originalname,
      hash,
      size: file.size,
      owner: "user1"
    });

    res.json({
      message: "File uploaded successfully",
      hash
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});

module.exports = router;
