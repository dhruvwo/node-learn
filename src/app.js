require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/userRoutes");
const feeds = require("./routes/feedRoutes");
const ai = require("./routes/aiRoutes");
const fileUpload = require("express-fileupload");
const expressWinston = require("express-winston");
const logger = require("./services/logger");

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

app.get("/log-warning", function (req, res) {
  logger.warn("this is logger warning");
  return res.status(200).json(true);
});

app.get("/log-info", function (req, res) {
  logger.info("this is logger info");
  return res.status(200).json(true);
});

app.get("/log-error", function (req, res) {
  logger.error("this is logger error");
  return res.status(200).json(true);
});

app.get("/version", function (req, res) {
  return res.json("1.0.0");
});

app.post("/upload", function (req, res) {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  sampleFile = req.files.file;
  uploadPath = __dirname + "\\uploads\\" + sampleFile.name;
  sampleFile.mv(uploadPath, function (err) {
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

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  })
);

module.exports = app;
