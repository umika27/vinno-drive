# Vinnodrive 🚀
A lightweight Google-Drive–like web app built with **Node.js, Express, MongoDB Atlas, and Vanilla HTML/CSS/JS**.

It supports:

- ✔ file upload
- ✔ hash-based deduplication
- ✔ MongoDB metadata storage
- ✔ reference counting deletion
- ✔ file listing
- ✔ download files
- ✔ public share links
- ✔ basic rate limiting (2 uploads/sec)
- ✔ clean UI

---

## 🖼️ Project Overview

When a user uploads a file:

- file content is hashed (SHA-256)
- duplicates are detected automatically
- only one physical copy is stored
- MongoDB saves metadata
- reference counts track duplicates
- files can be downloaded or shared via link

This drastically **saves storage space** by eliminating duplicates.

---

## 🏗️ Tech Stack

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas (Cloud)

**Other Libraries**
- Mongoose
- Multer (file upload)
- Crypto (hashing)
- express-rate-limit
- CORS

---

## 📂 Project Structure
```bash
├── index.html
├── node_modules
├── package-lock.json
├── package.json
├── README.md
├── server
│   ├── index.js
│   ├── middleware
│   ├── models
│   │   └── File.js
│   ├── routes
│   │   ├── files.js
│   │   └── upload.js
│   └── storage
│  
├── structure.txt
└── temp

```
---

## ⚙️ Environment Variables

Create a `.env` file in project root:
```bash
MONGO_URI=your_mongodb_connection_string
```

Use Atlas **SRV or Legacy URI** depending on your network.

---

## ▶️ How to Run Locally

```bash
npm install
node server/index.js
```
Then open:
```bash
index.html
``` 
in your browser.

---

## API Endpoints
- **Upload File**
```bash
POST /upload
```
Form-data -> key:file
- **List Files**
```bash
GET /files
```
- **Delete File**
```bash
DELETE /files/:id
```
- **Download File**
```bash
GET /files/download/:id
```
- **Generate Share Link**
```bash
POST /files/share/:id
```
- **Public Download Link**
```bash
GET /files/public/:token
```
---

## 💡 Features Explained
- **🧠 Deduplication**
Files stored by content hash.
Duplicate uploads do not duplicate storage.
- **🧮 Reference Counting**
- multiple uploads → reference count++
- delete reduces count
- last reference removed → physical deletion
- **🔗 Public Share Link**
Unique token allows direct download without UI.
- **⛔ Rate Limiting**
Upload capped at 2 requests/second to prevent abuse.

---

## 🛡️ Security Notes
- Never commit .env
- MongoDB user should have least privilege
- Share links can be revoked by resetting token

---

## 🙋‍♂️ Author
Project by **Umika Sood**

---
