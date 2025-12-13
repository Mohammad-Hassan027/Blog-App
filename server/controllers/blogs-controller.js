const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const { cloudinary, uploadImage } = require("../utils/cloudinary");
const {
  isValidObjectId,
  getRequestingUserUID,
  cleanupTempFile,
  normalizeDate,
  normalizeTags,
} = require("../utils/controllerUtils");

function checkAuth(req, res) {
  if (!req.user || !req.user.uid) {
    res.status(401).json({ error: "Authentication required." });
    return false;
  }
  return true;
}

async function getBlogs(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
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
    const requestingUserUID = getRequestingUserUID(req);

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
    const blogId = req.params.id;
    if (!blogId || !isValidObjectId(blogId)) {
      return res.status(400).json({ error: "Invalid or missing blogId" });
    }

    const blog = await Blog.findById(blogId).lean();
    if (!blog) return res.status(404).json({ error: "Not found" });

    const requestingUserUID = getRequestingUserUID(req);
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
  const blogId = req.params.id;
  if (!blogId || !isValidObjectId(blogId)) {
    return res.status(400).json({ error: "Invalid or missing blogId" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const requestingUserUID = getRequestingUserUID(req);
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

    const updateFields = {};

    const textFields = ["title", "description", "content", "status"];

    textFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        updateFields[field] = req.body[field];
      }
    });

    if (typeof imageUrl === "string") updateFields.imageUrl = imageUrl;
    if (typeof imagePublicId === "string")
      updateFields.imagePublicId = imagePublicId;

    if (tagsUpdate !== undefined) updateFields.tag = tagsUpdate;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
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
  const blogId = req.params.id;
  if (!blogId || !isValidObjectId(blogId)) {
    return res.status(400).json({ error: "Invalid or missing blogId" });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const requestingUserUID = getRequestingUserUID(req);
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

    await Blog.findByIdAndDelete(blogId);
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
