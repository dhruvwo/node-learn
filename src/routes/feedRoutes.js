const express = require("express");
const router = express.Router();
const auth = require("./../middleware/auth");

const feedController = require("../controllers/feedController");

router.get("/", auth, feedController.getAllFeeds);
router.get("/my-feeds", auth, feedController.getMyFeeds);
router.get("/feeds-with-users", auth, feedController.getFeedsWithUsers);
router.get("/:id", auth, feedController.getFeedById);
router.post("/", auth, feedController.createFeed);
router.put("/:id", auth, feedController.updateFeed);
router.delete("/:id", auth, feedController.deleteFeed);

module.exports = router;
