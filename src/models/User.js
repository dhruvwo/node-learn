const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  // Add more user properties as needed
});

module.exports = mongoose.model("User", userSchema);
