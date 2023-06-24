const Feed = require("../models/Feed");
const jwt = require("jsonwebtoken");

exports.getAllFeeds = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const count = await Feed.count();
  Feed.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .then((feeds) => {
      res.status(200).json({
        feeds,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
        },
      });
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

exports.getUserWithLookupInObj = (req, res) => {
  const pipeline = [
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        nameEmail: { $concat: ["$user.name", " ", "$user.email"] },
        title: 1,
      },
    },
  ];
  Feed.aggregate(pipeline)
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
