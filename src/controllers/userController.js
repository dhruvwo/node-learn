const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.nodeMailerEmail,
    pass: process.env.nodeMailerPassword,
    clientId: process.env.nodeMailerClientId,
    clientSecret: process.env.nodeMailerClientSecret,
    refreshToken: process.env.nodeMailerClientRefreshToken,
  },
});
const mailOptions = {
  from: "dhruv.webosmotic@gmail.com",
  subject: "Sending Email using Node.js",
  html: "<h1>Welcome</h1><p>That was easy!</p>",
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.usersWithFeeds = (req, res) => {
  User.aggregate([
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "feeds",
        localField: "_id",
        foreignField: "userId",
        as: "feeds",
      },
    },
    {
      $project: {
        name: 1,
        "feeds.title": 1,
      },
    },
  ])
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.concatNames = (req, res) => {
  const query = req.query;
  const pipeline = [
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "feeds",
        localField: "_id",
        foreignField: "userId",
        as: "feeds",
      },
    },
    {
      $project: {
        nameEmail: { $concat: ["$name", " ", "$email"] },
        name: 1,
        email: 1,
        "feeds.title": 1,
      },
    },
  ];
  if (query.search) {
    pipeline.push({
      $match: {
        nameEmail: { $regex: ".*" + query.search },
      },
    });
  }
  User.aggregate(pipeline)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.unwindFeeds = (req, res) => {
  const query = req.query;
  const pipeline = [
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "feeds",
        localField: "_id",
        foreignField: "userId",
        as: "feeds",
      },
    },
    { $unwind: "$feeds" },
    {
      $project: {
        nameEmail: { $concat: ["$name", " ", "$email"] },
        name: 1,
        email: 1,
        feed: "$feeds.title",
      },
    },
  ];
  if (query.search) {
    pipeline.push({
      $match: {
        nameEmail: { $regex: ".*" + query.search },
      },
    });
  }
  User.aggregate(pipeline)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.feedCounts = (req, res) => {
  const pipeline = [
    {
      $lookup: {
        from: "feeds",
        localField: "_id",
        foreignField: "userId",
        as: "feeds",
      },
    },
    {
      $addFields: {
        feedCount: { $size: "$feeds" },
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        "feeds.title": 1,
        feedCount: 1,
      },
    },
  ];
  User.aggregate(pipeline)
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.createUser = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
  });
  user
    .save()
    .then((createdUser) => {
      res.status(201).json(createdUser);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.deleteUser = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim()?.toLowerCase();
    if (!(email && password)) {
      return res.status(400).send("email & password are required");
    }
    const foundUser = await User.findOne({
      email,
    });
    if (!foundUser) {
      return res.status(400).send("Invalid email");
    }
    const isValidPassword = await bcrypt.compare(password, foundUser.password);
    if (!isValidPassword) {
      return res.status(400).send("Invalid password");
    }
    const token = jwt.sign(
      { user_id: foundUser._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "200h",
      }
    );
    return res.status(200).json({
      user: {
        name: foundUser.name,
        email: foundUser.email,
        userId: foundUser._id,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong!");
  }
};
exports.sendMail = async (req, res) => {
  try {
    const { email } = req.body;
    transporter.sendMail({ ...mailOptions, to: email }, function (error, info) {
      if (error) {
        return res.status(400).json(error);
      } else {
        return res.status(200).json({
          success: true,
          message: `Mail sent to ${email}`,
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong!");
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(email && password && name)) {
      return res.status(400).send("name, email & password are required");
    }
    const oldUser = await User.findOne({ email });
    console.log("oldUser", oldUser);
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: encryptedPassword,
    });
    console.log("created users wohooo!", user);
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong!");
  }
};
