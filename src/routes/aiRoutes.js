const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const aiController = require("../controllers/aiController");

router.get("/ask-ai", auth, aiController.askAi);

module.exports = router;
