require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/userRoutes");
const feeds = require("./routes/feedRoutes");
const ai = require("./routes/aiRoutes");
const fileUpload = require("express-fileupload");
const expressWinston = require("express-winston");
const logger = require("./services/logger");
const { buildPDF } = require("./services/pdfService");
const { generateHtmlPdf } = require("./services/htmlToPdf");

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
  return res.json("1.1.1");
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

app.get("/version", function (req, res) {
  return res.json("1.0.0");
});

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

app.get("/get-pdf", (req, res) => {
  try {
    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment;filename=invoice.pdf`,
    });
    let counter = 0;
    buildPDF(
      (chunk) => {
        counter++;
        console.log("data update", counter);
        stream.write(chunk);
      },
      () => {
        console.log("stream ended");
        stream.end();
      }
    );
  } catch (err) {
    console.log(err);
    logger.error("err", err);
    return res.status(500).send("Something went wrong!");
  }
});

app.get("/get-pdf-from-template", async (req, res) => {
  try {
    const pdfBuffer = await generateHtmlPdf();
    console.log("done", { pdfBuffer });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment;filename=template.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);
    logger.error("err", err);
    return res.status(500).send("Something went wrong!");
  }
});

app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  })
);

app.use((req, res) => {
  res.status(404).send("Can not find route!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
