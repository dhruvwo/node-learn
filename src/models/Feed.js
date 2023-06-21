const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Feed", feedSchema);
