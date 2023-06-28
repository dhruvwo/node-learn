const express = require("express");
const logger = require("../services/logger");
const router = express.Router();

router.get("/warning", function (req, res) {
  logger.warn("this is logger warning");
  return res.status(200).json(true);
});

router.get("/info", function (req, res) {
  logger.info("this is logger info");
  return res.status(200).json(true);
});

router.get("/error", function (req, res) {
  logger.error("this is logger error");
  return res.status(200).json(true);
});

module.exports = router;
