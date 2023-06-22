const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("get destination for ", file);
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log("get name for ", file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileUploads = multer({ storage: storage, dest: "uploads/" });
module.exports = fileUploads;
