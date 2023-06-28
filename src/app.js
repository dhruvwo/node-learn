require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressWinston = require("express-winston");
const logger = require("./services/logger");
const router = require("./routes/router");

const app = express({});

app.use(bodyParser.json());

app.use(fileUpload());

app.use("/", router);

app.get("/version", function (req, res) {
  return res.json("1.1.1");
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
