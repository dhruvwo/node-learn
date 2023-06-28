const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");

router.get("/ask-ai", aiController.askAi);

module.exports = router;
