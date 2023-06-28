const express = require("express");
const router = express.Router();

router.get("/file-uploader", (req, res) => {
  res.send(`
      <h1>File Upload</h1>
      <form method="POST" action="/uploadFile" enctype="multipart/form-data">
        <input type="file" name="file" />
        <input type="submit" value="Upload" />
      </form>
    `);
});

router.post("/upload", function (req, res) {
  let sampleFile;
  let uploadPath;
  console.log("req.files", req.files);
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

module.exports = router;
