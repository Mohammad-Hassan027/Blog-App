const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const { cloudinary, uploadImage } = require("../utils/cloudinary");
const fs = require("fs").promises;
const os = require("os");
const path = require("path");

const TEMP_UPLOAD_ROOT = path.join(os.tmpdir(), "blog-app-uploads");

function checkAuth(req, res) {
  if (!req.user || !req.user.uid) {
    res.status(401).json({ error: "Authentication required." });
    return false;
  }
  return true;
}

async function cleanupTempFile(tempFilePath) {
  if (!tempFilePath) return;

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
    // Ignore ENOENT (file not found) errors, which can happen if it was already deleted
    if (cleanupErr.code !== "ENOENT") {
      console.error("Failed to delete temp file:", cleanupErr);
    }
  }
}

function normalizeTags(tagInput) {
  if (Array.isArray(tagInput)) return tagInput.filter(Boolean);

  if (typeof tagInput === "string" && tagInput.trim() !== "") {
    return tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return undefined;
}

function normalizeDate(dateInput) {
  if (!dateInput) return undefined;
  const c = dateInput;
  // If it can be parsed as a number, treat it as a timestamp
  if (!isNaN(Number(c))) return new Date(Number(c));
  // Otherwise, treat it as a date string
  const date = new Date(c);
  return isNaN(date.getTime()) ? undefined : date;
}


async function getBlogs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { status: "published" };

    const [totalPosts, blogs] = await Promise.all([
      Blog.countDocuments(filter),
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

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
  if (!checkAuth(req, res)) return;

  try {
    const requestingUserUID = req.user.uid;

    const blogs = await Blog.find({
      authorUID: requestingUserUID,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(blogs);
  } catch (err) {
    console.error("GET /api/myposts error:", err);
    res.status(500).json({ error: "Failed to fetch user blogs" });
  }
}

async function getBlogById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) return res.status(404).json({ error: "Not found" });

    const requestingUserUID = req.user ? req.user.uid : null;
    const authorUID = blog.authorUID || null;

    if (blog.status !== "published") {
      if (!requestingUserUID || requestingUserUID !== authorUID) {
        return res
          .status(403)
          .json({ error: "Not authorized to view this draft blog" });
      }
    }

    res.json(blog);
  } catch (err) {
    console.error("GET /api/blogs/:id error:", err);
    if (err.name === "CastError" && err.kind === "ObjectId") {
      return res.status(400).json({ error: "Invalid blog ID format" });
    }
    res.status(500).json({ error: "Failed to fetch blog" });
  }
}

async function createBlog(req, res) {
  if (!checkAuth(req, res)) return;

  let tempFilePath = req.file ? req.file.path : null;

  try {
    let imageUrl = req.body.imageUrl;
    let imagePublicId = req.body.imagePublicId;

    if (req.file) {
      const uploadResult = await uploadImage(tempFilePath, {
        folder: "blogs",
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const tags = normalizeTags(req.body.tag) || [];
    const createdAt = normalizeDate(req.body.createdAt);

    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.user.name || req.user.email || req.body.author || "Unknown",
      authorUID: req.user.uid,
      imageUrl,
      imagePublicId,
      tag: tags,
      status: req.body.status || "published",
      ...(createdAt ? { createdAt } : {}),
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error("POST /api/blogs error:", err);
    const message =
      process.env.NODE_ENV === "production"
        ? "Failed to create blog"
        : err.message || String(err);
    res.status(500).json({ error: message });
  } finally {
    await cleanupTempFile(tempFilePath);
  }
}

async function updateBlog(req, res) {
  if (!checkAuth(req, res)) return;

  let tempFilePath = req.file ? req.file.path : null;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const requestingUserUID = req.user.uid;
    const authorUID = blog.authorUID || null;

    if (requestingUserUID !== authorUID) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this blog" });
    }

    let imageUrl = req.body.imageUrl || blog.imageUrl;
    let imagePublicId = req.body.imagePublicId || blog.imagePublicId;

    if (req.file) {
      if (blog.imagePublicId) {
        try {
          // Use the internal cloudinary object consistently
          await cloudinary.uploader.destroy(blog.imagePublicId);
        } catch (err) {
          console.error("Failed to delete old image in updateBlog:", err);
        }
      }
      const uploadResult = await uploadImage(tempFilePath, {
        folder: "blogs",
      });
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const tagsUpdate = normalizeTags(req.body.tag);
    const createdAtUpdate = normalizeDate(req.body.createdAt);

    const updateFields = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      imageUrl: imageUrl,
      imagePublicId: imagePublicId,
      status: req.body.status || blog.status,
    };

    // Only include tags/createdAt if they were provided in the request
    if (tagsUpdate !== undefined) updateFields.tag = tagsUpdate;
    if (createdAtUpdate !== undefined) updateFields.createdAt = createdAtUpdate;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    console.error("PUT /api/blogs/:id error:", err);
    res.status(500).json({ error: "Failed to update blog" });
  } finally {
    await cleanupTempFile(tempFilePath);
  }
}

async function deleteBlog(req, res) {
  if (!checkAuth(req, res)) return;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const requestingUserUID = req.user.uid;
    const authorUID = blog.authorUID || null;

    if (requestingUserUID !== authorUID) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      } catch (err) {
        console.error(
          "Failed to delete image from Cloudinary:",
          blog.imagePublicId,
          err
        );
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
    console.error("DELETE /api/blogs/:id error:", err);
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
