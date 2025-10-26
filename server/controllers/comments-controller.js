const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const mongoose = require("mongoose");
const {
  isValidObjectId,
  getRequestingUserUID,
} = require("../utils/controllerUtils");

async function getComments(req, res) {
  try {
    const { blogId } = req.query;

    if (!blogId || !isValidObjectId(blogId)) {
      return res.status(400).json({ error: "Invalid or missing blogId" });
    }

    const [blog, comments] = await Promise.all([
      Blog.findById(blogId).lean(),
      Comment.find({ blogId }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.status !== "published") {
      const requestingUserUID = getRequestingUserUID(req);
      const blogAuthorUID = blog.authorUID || null;

      if (!requestingUserUID || requestingUserUID !== blogAuthorUID) {
        return res.status(403).json({
          error:
            "Not authorized to view comments for this unpublished blog post",
        });
      }
    }

    res.json(comments);
  } catch (err) {
    console.error("GET /api/comments error:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

async function createComment(req, res) {
  try {
    const { blogId, author, text, avatar } = req.body;

    if (!blogId || !text) {
      return res
        .status(400)
        .json({ error: "Missing required fields (blogId, text)" });
    }

    if (!isValidObjectId(blogId)) {
      return res.status(400).json({ error: "Invalid blogId format" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const requestingUserUID = getRequestingUserUID(req);

    const comment = new Comment({
      blogId,
      author: req.user
        ? req.user.name || req.user.email
        : author || "Anonymous",
      authorUID: requestingUserUID,
      text,
      avatar: (req.user && req.user.picture) || avatar || null,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error("POST /api/comments error:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
}

async function deleteComment(req, res) {
  try {
    const commentId = req.params.id;

    if (!isValidObjectId(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID format" });
    }

    // Find the comment and related blog concurrently
    const [comment, blog] = await Promise.all([
      Comment.findById(commentId),
      Comment.findById(commentId).then((c) =>
        c ? Blog.findById(c.blogId).lean() : null
      ),
    ]);

    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const requestingUserUID = getRequestingUserUID(req);
    const commentAuthorUID = comment.authorUID || null;
    const blogAuthorUID = blog ? blog.authorUID || null : null;

    const isCommentAuthor =
      requestingUserUID && requestingUserUID === commentAuthorUID;
    const isBlogAuthor =
      requestingUserUID && requestingUserUID === blogAuthorUID;

    if (!isCommentAuthor && !isBlogAuthor) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(204).send();
  } catch (err) {
    console.error("DELETE /api/comments/:id error:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
}

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
