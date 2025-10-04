require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Blog = require("../models/Blog");

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Read the Blog.json file
    const blogData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../client/public/Blog.json"),
        "utf-8"
      )
    );

    // Clean existing data
    await Blog.deleteMany({});
    console.log("Cleaned existing blog data");

    // Helper: parse a variety of date formats (prefer createdAt, fall back to legacy Date)
    function parseDate(value) {
      if (!value) return new Date();
      // Try native parsing first
      const d = new Date(value);
      if (!isNaN(d)) return d;

      if (typeof value === "string") {
        const s = value.trim();

        // Match DD/MM/YYYY or DD-MM-YYYY with optional time and am/pm
        const dm = s.match(
          /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:[,\s]+(.+))?$/
        );
        if (dm) {
          const day = parseInt(dm[1], 10);
          const month = parseInt(dm[2], 10) - 1;
          let year = parseInt(dm[3], 10);
          if (year < 100) {
            year += year < 70 ? 2000 : 1900;
          }
          const timePart = (dm[4] || "").trim();

          let hours = 0,
            minutes = 0,
            seconds = 0;
          let ampm = null;

          if (timePart) {
            const ampmMatch = timePart.match(/(am|pm)$/i);
            if (ampmMatch) ampm = ampmMatch[1].toLowerCase();

            const timeOnly = timePart.replace(/(am|pm)$/i, "").trim();
            const parts = timeOnly.split(/[:\s]/).filter(Boolean);
            if (parts.length >= 1) hours = parseInt(parts[0], 10) || 0;
            if (parts.length >= 2) minutes = parseInt(parts[1], 10) || 0;
            if (parts.length >= 3) seconds = parseInt(parts[2], 10) || 0;

            if (ampm) {
              if (ampm === "pm" && hours < 12) hours += 12;
              if (ampm === "am" && hours === 12) hours = 0;
            }
          }

          return new Date(year, month, day, hours, minutes, seconds);
        }
      }

      // Fallback
      return new Date();
    }

    // Transform data to match our schema
    const transformedData = blogData.map((blog) => {
      // Normalize tags: accept array or comma-separated string
      const tags = Array.isArray(blog.tag)
        ? blog.tag
        : typeof blog.tag === "string"
        ? blog.tag
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      // Prefer blog.createdAt, then legacy blog.Date, otherwise now
      const createdAt = blog.createdAt
        ? parseDate(blog.createdAt)
        : blog.Date
        ? parseDate(blog.Date)
        : new Date();

      return {
        title: blog.title,
        description: blog.description,
        content: blog.content,
        author: blog.author,
        imageUrl: blog.imageUrl,
        tag: tags,
        createdAt,
        comments: Array.isArray(blog.comments) ? blog.comments : [],
      };
    });

    // Insert the data
    await Blog.insertMany(transformedData);
    console.log(`Successfully seeded ${transformedData.length} blog posts`);

    mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
