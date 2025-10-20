const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  content: String,
  author: String,
  imageUrl: String,
  imagePublicId: String, // Store Cloudinary public_id for more reliable deletion
  tag: [String],
  status: { type: String, enum: ["draft", "published"], default: "published" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", BlogSchema);
