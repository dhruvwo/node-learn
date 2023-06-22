const Feed = require("../models/Feed");
const jwt = require("jsonwebtoken");

exports.getAllFeeds = (req, res) => {
  Feed.find()
    .then((feeds) => {
      res.status(200).json(feeds);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getFeedById = (req, res) => {
  Feed.findById(req.params.id)
    .then((feed) => {
      if (!feed) {
        return res.status(404).json({ message: "Feed not found" });
      }
      res.status(200).json(feed);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getMyFeeds = (req, res) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  console.log("decoded", decoded);
  Feed.find({
    userId: decoded.user_id,
  })
    .then((feed) => {
      if (!feed) {
        return res.status(404).json({ message: "Feed not found" });
      }
      res.status(200).json(feed);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getFeedsWithUsers = (req, res) => {
  const page = req.query.page || 1; // Current page number
  const limit = 10; // Number of feeds per page
  const skip = (page - 1) * limit; // Number of feeds to skip

  Feed.find()
    .populate("userId", "name")
    .skip(skip)
    .limit(limit)
    .then((feed) => {
      if (!feed) {
        return res.status(404).json({ message: "Feed not found" });
      }
      res.status(200).json(feed);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.fileUpload = (req, res) => {};

exports.createFeed = (req, res) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const feed = new Feed({
    ...req.body,
    userId: decoded.user_id,
  });
  feed
    .save()
    .then((createdFeed) => {
      res.status(201).json(createdFeed);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.updateFeed = (req, res) => {
  Feed.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedFeed) => {
      if (!updatedFeed) {
        return res.status(404).json({ message: "Feed not found" });
      }
      res.status(200).json(updatedFeed);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.deleteFeed = (req, res) => {
  Feed.findByIdAndDelete(req.params.id)
    .then((deletedFeed) => {
      if (!deletedFeed) {
        return res.status(404).json({ message: "Feed not found" });
      }
      res.status(200).json({ message: "Feed deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
