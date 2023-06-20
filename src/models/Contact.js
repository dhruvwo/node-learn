// src/models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  // Add more contact properties as needed
});

module.exports = mongoose.model("Contact", contactSchema);
