const User = require("../models/User");

exports.getAllUsers = (req, res) => {
  User.find()
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
