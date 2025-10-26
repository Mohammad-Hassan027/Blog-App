const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  author: { type: String, default: "Anonymous" },
  authorUID: { type: String, required: false },
  text: { type: String, required: true },
  avatar: String,
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
