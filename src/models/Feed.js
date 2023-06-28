const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, require: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Feed", feedSchema);

const feeds = mongoose.model("feeds", feedSchema);
module.exports = feeds;
