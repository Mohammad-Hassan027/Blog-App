require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

function isCloudinaryUrl(url) {
  return url && url.includes("res.cloudinary.com");
}

async function extractPublicId(imageUrl) {
  if (!imageUrl) return null;

  // Skip non-Cloudinary URLs
  if (!isCloudinaryUrl(imageUrl)) {
    return { skipped: true, reason: "non-cloudinary" };
  }

  try {
    // Example Cloudinary URL structure:
    // https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/folder/subfolder/public-id.jpg
    const uploadIndex = imageUrl.indexOf("/upload/");
    if (uploadIndex === -1) {
      return { skipped: true, reason: "invalid-cloudinary-url" };
    }

    // Take the part after '/upload/'
    let publicPath = imageUrl.substring(uploadIndex + "/upload/".length);
    // Remove version prefix if present (e.g. v1234567890/)
    publicPath = publicPath.replace(/^v\d+\//, "");
    // Remove file extension
    const publicId = publicPath.replace(/\.[^/.]+$/, "");

    return publicId ? { publicId } : { skipped: true, reason: "no-public-id" };
  } catch (err) {
    console.error("Failed to extract public_id from URL:", imageUrl, err);
    return { skipped: true, reason: "error", error: err };
  }
}

async function migrateBlogImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find blogs with imageUrl but no imagePublicId
    const blogs = await Blog.find({
      imageUrl: { $exists: true, $ne: null },
      $or: [{ imagePublicId: { $exists: false } }, { imagePublicId: null }],
    });

    console.log(`Found ${blogs.length} blogs to process\n`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    const skippedReasons = new Map(); // Track counts of different skip reasons

    // Process each blog
    for (const blog of blogs) {
      try {
        const result = await extractPublicId(blog.imageUrl);

        if (result.skipped) {
          // Count skipped by reason
          const count = skippedReasons.get(result.reason) || 0;
          skippedReasons.set(result.reason, count + 1);

          // Only show detailed skip messages for unexpected cases
          if (result.reason !== "non-cloudinary") {
            console.log(`→ Skipped blog ${blog._id}: ${result.reason}`);
          }
          skippedCount++;
          continue;
        }

        await Blog.findByIdAndUpdate(blog._id, {
          $set: { imagePublicId: result.publicId },
        });
        console.log(`✓ Updated blog ${blog._id}: ${result.publicId}`);
        successCount++;
      } catch (err) {
        console.error(`✗ Failed to update blog ${blog._id}:`, err);
        errorCount++;
      }
    }

    // Detailed summary
    console.log("\nMigration complete!");
    console.log(`Processed ${blogs.length} blogs`);
    console.log(`✓ Successfully updated: ${successCount}`);
    console.log(`→ Skipped: ${skippedCount}`);

    // Show skip reasons summary
    if (skippedReasons.size > 0) {
      console.log("\nSkipped images breakdown:");
      for (const [reason, count] of skippedReasons) {
        console.log(`  ${reason}: ${count}`);
      }
    }

    console.log(`✗ Errors: ${errorCount}`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run the migration
migrateBlogImages().catch(console.error);
