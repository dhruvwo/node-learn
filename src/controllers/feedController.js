const Feed = require("../models/Feed");

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

exports.createFeed = (req, res) => {
  const feed = new Feed(req.body);

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
