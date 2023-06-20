// src/controllers/userController.js
const User = require("../models/User");

// Get all users
exports.getAllUsers = (req, res) => {
  // Retrieve and return all users from the database
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Get a single user by ID
exports.getUserById = (req, res) => {
  // Retrieve and return a user by ID from the database
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

// Create a new user
exports.createUser = (req, res) => {
  // Create a new user using the request body
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    // Add more user properties as needed
  });

  // Save the user to the database
  user
    .save()
    .then((createdUser) => {
      res.status(201).json(createdUser);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

// Update a user by ID
exports.updateUser = (req, res) => {
  // Find and update a user by ID in the database
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

// Delete a user by ID
exports.deleteUser = (req, res) => {
  // Find and delete a user by ID from the database
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
