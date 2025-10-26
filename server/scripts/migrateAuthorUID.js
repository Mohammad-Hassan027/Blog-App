require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

const AUTHORS_MAP = {
  "Mohammad Hassan Shaikh": "8Q8AgxIWKZarWvJ2DHcSCttgJFr1",
  "Zainab Shaikh": "u9yF2qCIAvWodunl1ZKyGI0OlUx1",
};

async function migrateAuthorUIDs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Migrate Blogs
    const blogs = await Blog.find({});
    console.log(`Found ${blogs.length} blogs to migrate`);

    for (const blog of blogs) {
      const authorUID = AUTHORS_MAP[blog.author] || null;
      await Blog.findByIdAndUpdate(blog._id, { authorUID });
      console.log(`Updated blog: ${blog._id} with authorUID: ${authorUID}`);
    }

    // Migrate Comments
    const comments = await Comment.find({});
    console.log(`Found ${comments.length} comments to migrate`);

    for (const comment of comments) {
      const authorUID = AUTHORS_MAP[comment.author] || null;
      await Comment.findByIdAndUpdate(comment._id, { authorUID });
      console.log(
        `Updated comment: ${comment._id} with authorUID: ${authorUID}`
      );
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the migration
migrateAuthorUIDs();
