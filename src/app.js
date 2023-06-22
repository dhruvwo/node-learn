require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/userRoutes");
const feeds = require("./routes/feedRoutes");
const ai = require("./routes/aiRoutes");
const fileUpload = require("express-fileupload");

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

app.use(fileUpload());

app.get("/version", function (req, res) {
  return res.json("1.0.0");
});

app.post("/upload", function (req, res) {
  let sampleFile;
  let uploadPath;
  console.log(" req.files", req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.file;
  console.log("sampleFile", sampleFile);
  uploadPath = __dirname + "\\uploads\\" + sampleFile.name;
  console.log("uploadPath", uploadPath);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    console.log("err", err);
    if (err) return res.status(500).send(err);

    res.send("File uploaded!");
  });
});

app.use((req, res) => {
  res.status(404).send("Can not find route!");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
