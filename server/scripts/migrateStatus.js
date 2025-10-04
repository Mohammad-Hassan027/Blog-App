require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

async function migrateBlogStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for status migration");

    // Find blogs where the 'status' field does not exist and update them
    const result = await Blog.updateMany(
      { status: { $exists: false } }, // Filter for documents missing the status field
      { $set: { status: "published" } } // Set the default status
    );

    console.log("Migration complete.");
    console.log(
      `Successfully updated ${result.modifiedCount} blog posts to have a 'published' status.`
    );

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error migrating blog statuses:", error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
}

migrateBlogStatus();
