const express = require("express");
const File = require("../models/File");

const router = express.Router();

// GET /files → list all files
router.get("/", async (req, res) => {
  try {
    const files = await File.find({}, {
      filename: 1,
      size: 1,
      uploadedAt: 1,
      referenceCount: 1,
      isPublic: 1
    });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch files");
  }
});


const fs = require("fs");
const path = require("path");

// DELETE /files/:id
router.delete("/:id", async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    // CASE 1: Reference file
    if (file.isReference) {
      await File.findByIdAndDelete(fileId);
      return res.send("Reference deleted");
    }

    // CASE 2: Original file with multiple references
    if (file.referenceCount > 1) {
      file.referenceCount -= 1;
      await file.save();
      return res.send("Reference count decremented");
    }

    // CASE 3: Original file with only one reference
    const storagePath = path.join("server/storage", file.hash);

    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
    }

    await File.findByIdAndDelete(fileId);

    res.send("File deleted completely");

  } catch (err) {
    console.error(err);
    res.status(500).send("Delete failed");
  }
});


router.get("/download/:id", async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    const filePath = path.join("server/storage", file.hash);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Stored file missing");
    }

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    res.download(filePath, file.filename);

  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});
const crypto = require("crypto");

// POST /files/share/:id  → generate share token
router.post("/share/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).send("File not found");
    }

    // if already has token, reuse it
    if (!file.shareToken) {
      file.shareToken = crypto.randomBytes(16).toString("hex");
      await file.save();
    }

    const publicUrl = `http://localhost:8081/files/public/${file.shareToken}`;

    res.json({
      message: "Share link created",
      url: publicUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create share link");
  }
});
// GET /files/public/:token → download via share token
router.get("/public/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const file = await File.findOne({ shareToken: token });

    if (!file) {
      return res.status(404).send("Invalid or expired link");
    }

    const filePath = path.join("server/storage", file.hash);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File missing from storage");
    }

    file.downloadCount += 1;
    await file.save();

    res.download(filePath, file.filename);

  } catch (err) {
    console.error(err);
    res.status(500).send("Public download failed");
  }
});


module.exports = router;