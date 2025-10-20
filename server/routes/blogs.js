const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const multer = require("multer");
const { cloudinary, uploadImage } = require("../utils/cloudinary");
const { firebaseAuth } = require("../middleware/authFirebase");
const path = require("path");
const os = require("os");
const fs = require("fs");

// Ensure cross-platform temporary upload directory
const tmpDir = path.join(os.tmpdir(), "blog-app-uploads");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({ dest: tmpDir });

// GET /api/blogs - list all PUBLISHED blogs for public view
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { status: "published" };
    const totalPosts = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      blogs,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// GET /api/blogs/my-posts - list all posts for the logged in user (drafts and published)
router.get("/my-posts", firebaseAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user logged in" });
    }

    const blogs = await Blog.find({
      author: { $in: [req.user.name, req.user.email] },
    })
      .sort({ createdAt: -1 })
      .lean();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user blogs" });
  }
});

// GET /api/blogs/:id
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// POST /api/blogs - create (requires auth)
router.post("/", firebaseAuth, upload.single("image"), async (req, res) => {
  try {
    // optional image upload
    let imageUrl = req.body.imageUrl;
    let imagePublicId = req.body.imagePublicId; // Allow passing existing public_id
    if (req.file) {
      const uploadResult = await uploadImage(req.file.path, {
        folder: "blogs",
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id; // Store Cloudinary's public_id
    }

    // normalize tags: accept array or comma-separated string
    let tags = [];
    if (Array.isArray(req.body.tag)) tags = req.body.tag;
    else if (typeof req.body.tag === "string" && req.body.tag.trim() !== "")
      tags = req.body.tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    // normalize createdAt if provided (allow timestamp or date string)
    let createdAt = undefined;
    if (req.body.createdAt) {
      const c = req.body.createdAt;
      if (!isNaN(Number(c))) createdAt = new Date(Number(c));
      else createdAt = new Date(c);
    }

    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.user ? req.user.name || req.user.email : req.body.author,
      imageUrl,
      imagePublicId, // Store the Cloudinary public_id
      tag: tags,
      status: req.body.status || "published",
      ...(createdAt ? { createdAt } : {}),
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to create blog"
        : err.message || String(err);
    res.status(500).json({ error: message });
  }
});

// PUT /api/blogs/:id - update blog (requires auth)
router.put("/:id", firebaseAuth, upload.single("image"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Check if user is the author (compare email or display name)
    if (req.user.email !== blog.author && req.user.name !== blog.author) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this blog" });
    }

    let imageUrl = req.body.imageUrl;
    let imagePublicId = req.body.imagePublicId;
    if (req.file) {
      // If replacing an existing image, try to delete the old one first
      if (blog.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(blog.imagePublicId);
        } catch (err) {
          console.error("Failed to delete old image:", err);
          // Continue with upload even if deletion fails
        }
      }
      const uploadResult = await uploadImage(req.file.path, {
        folder: "blogs",
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    // normalize tags for update
    let tagsUpdate = undefined;
    if (req.body.tag) {
      if (Array.isArray(req.body.tag)) tagsUpdate = req.body.tag;
      else if (typeof req.body.tag === "string")
        tagsUpdate = req.body.tag
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    }

    // normalize createdAt for update
    let createdAtUpdate = undefined;
    if (req.body.createdAt) {
      const c = req.body.createdAt;
      createdAtUpdate = !isNaN(Number(c)) ? new Date(Number(c)) : new Date(c);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        imageUrl: imageUrl || blog.imageUrl,
        imagePublicId: imagePublicId || blog.imagePublicId,
        tag: tagsUpdate || blog.tag,
        status: req.body.status || blog.status,
        ...(createdAtUpdate ? { createdAt: createdAtUpdate } : {}),
      },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// DELETE /api/blogs/:id - delete blog (requires auth)
router.delete("/:id", firebaseAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Check if user is the author
    if (req.user.email !== blog.author && req.user.name !== blog.author) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    // Delete the blog's image from Cloudinary if it exists
    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId).catch((err) => {
          // Log but continue with blog deletion even if image deletion fails
          console.error(
            "Failed to delete image from Cloudinary:",
            blog.imagePublicId,
            err
          );
        });
      } catch (err) {
        console.error("Error during image deletion:", err);
        // Continue with blog deletion even if image deletion fails
      }
    }

    // Delete associated comments for this blog (non-blocking for image deletion)
    try {
      await Comment.deleteMany({ blogId: blog._id });
    } catch (err) {
      console.error("Failed to delete associated comments:", err);
      // continue even if comment deletion fails
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

module.exports = router;
