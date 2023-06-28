const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const feedController = require("../controllers/feedController");

function validateFeedData(req, res, next) {
  const { title, description, image } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!image) {
    return res.status(400).json({ message: "image is required" });
  }
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    return res.status(400).json({
      message: "Invalid file format. Only JPEG and PNG images are allowed",
    });
  }

  next();
}

router.get("/", auth, feedController.getAllFeeds);
router.get("/my-feeds", auth, feedController.getMyFeeds);
router.get("/feeds-with-users", auth, feedController.getFeedsWithUsers);
router.get("/lookup-obj", auth, feedController.getUserWithLookupInObj);
router.get("/:id", auth, feedController.getFeedById);

router.post("/", auth, feedController.createFeed);
router.put("/:id", auth, feedController.updateFeed);
router.delete("/:id", auth, feedController.deleteFeed);

module.exports = router;
