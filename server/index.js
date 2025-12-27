const rateLimit = require("express-rate-limit");
const filesRoute = require("./routes/files");
const cors = require("cors");
const uploadRoute = require("./routes/upload"); 
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());
// Global rate limiter: 2 requests per second
const limiter = rateLimit({
  windowMs: 1000,      // 1 second
  max: 2,              // limit to 2 requests per window per IP
  message: "Too many requests, slow down 🙂",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Middleware

app.use("/files", filesRoute);

app.use("/upload", uploadRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Vinnodrive server running on 8081 🚀");
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Start server
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const File = require("./models/File");

app.get("/test-db", async (req, res) => {
  const files = await File.find();
  res.json(files);
});
