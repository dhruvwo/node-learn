require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/userRoutes");
const feeds = require("./routes/feedRoutes");
const ai = require("./routes/aiRoutes");
const fileUploads = require("./middleware/fileUploads");

const app = express({});

app.use(bodyParser.json());

app.use("/users", users);
app.use("/feeds", feeds);
app.use("/ai", ai);
app.get("/file-uploader", (req, res) => {
  res.send(`
    <h1>File Upload</h1>
    <form method="POST" action="/uploadFile" enctype="multipart/form-data">
      <input type="file" name="file" />
      <input type="submit" value="Upload" />
    </form>
  `);
});
app.post("/uploadFile", fileUploads.single("file"), (req, res) => {
  const originalFileName = req.file.originalname;
  const uploadedFilePath = req.file.path;

  console.log("newFilePath", { uploadedFilePath, originalFileName });
  // Perform further operations on the uploaded file as needed

  // Return a success response
  res.send("File uploaded and processed successfully.");
});

app.use((req, res) => {
  res.status(404).send("Can not find route!");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
