const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  hash: String,
  size: Number,
  owner: String,
  isReference: { type: Boolean, default: false },
  referenceCount: { type: Number, default: 1 },
  isPublic: { type: Boolean, default: false },
  downloadCount: { type: Number, default: 0 },
  shareToken: { type: String, default: null },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);
