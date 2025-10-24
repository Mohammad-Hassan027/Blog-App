const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const { cloudinary, uploadImage } = require("../utils/cloudinary");
const fs = require("fs").promises;
const os = require("os");
const path = require("path");

const TEMP_UPLOAD_ROOT = path.join(os.tmpdir(), "blog-app-uploads");

async function getBlogs(req, res) {
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
    console.error("GET /api/blogs error:", err);
    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to fetch blogs"
        : err.message || String(err);
    res.status(500).json({ error: message });
  }
}

async function getMyPosts(req, res) {
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
}

async function getBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
}

async function createBlog(req, res) {
  let tempFilePath = req.file ? req.file.path : null;

  try {
    let imageUrl = req.body.imageUrl;
    let imagePublicId = req.body.imagePublicId; // Allow passing existing public_id
    if (req.file) {
      const uploadResult = await uploadImage(tempFilePath, {
        folder: "blogs",
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
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
      imagePublicId,
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
  } finally {
    if (tempFilePath) {
      try {
        // Validate temp file path before deleting
        const resolvedTempPath = path.resolve(tempFilePath);
        if (resolvedTempPath.startsWith(TEMP_UPLOAD_ROOT)) {
          await fs.unlink(resolvedTempPath);
        } else {
          console.warn(
            `Refusing to delete file outside temp upload dir: ${resolvedTempPath}`
          );
        }
      } catch (cleanupErr) {
        console.error("Failed to delete temp file (createBlog):", cleanupErr);
      }
    }
  }
}

async function updateBlog(req, res) {
  let tempFilePath = req.file ? req.file.path : null;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

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
        }
      }
      const uploadResult = await uploadImage(tempFilePath, {
        folder: "blogs",
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    let tagsUpdate = undefined;
    if (req.body.tag) {
      if (Array.isArray(req.body.tag)) tagsUpdate = req.body.tag;
      else if (typeof req.body.tag === "string")
        tagsUpdate = req.body.tag
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    }

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
  } finally {
    if (tempFilePath) {
      try {
        const resolvedTempPath = path.resolve(tempFilePath);
        if (resolvedTempPath.startsWith(TEMP_UPLOAD_ROOT)) {
          await fs.unlink(resolvedTempPath);
        } else {
          console.warn(
            `Refusing to delete file outside temp upload dir: ${resolvedTempPath}`
          );
        }
      } catch (cleanupErr) {
        console.error("Failed to delete temp file (updateBlog):", cleanupErr);
      }
    }
  }
}

async function deleteBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (req.user.email !== blog.author && req.user.name !== blog.author) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    // Delete the blog's image from Cloudinary if it exists
    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId).catch((err) => {
          console.error(
            "Failed to delete image from Cloudinary:",
            blog.imagePublicId,
            err
          );
        });
      } catch (err) {
        console.error("Error during image deletion:", err);
      }
    }

    try {
      await Comment.deleteMany({ blogId: blog._id });
    } catch (err) {
      console.error("Failed to delete associated comments:", err);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
}

module.exports = {
  getBlogs,
  getMyPosts,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
