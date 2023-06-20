const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
});

module.exports = mongoose.model("Feed", feedSchema);
