const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      $lookup: {
        from: "feeds",
        localField: "_id",
        foreignField: "userId",
        as: "feeds",
      },
    },
    {
      $limit: 5,
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
