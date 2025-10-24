const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

async function getComments(req, res) {
  try {
    const { blogId } = req.query;
    const filter = {};
    if (blogId) filter.blogId = blogId;
    const comments = await Comment.find(filter).sort({ createdAt: -1 }).lean();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

async function createComment(req, res) {
  try {
    const { blogId, author, text, avatar } = req.body;
    if (!blogId || !text)
      return res.status(400).json({ error: "Missing fields" });

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const comment = new Comment({
      blogId,
      author: req.user
        ? req.user.name || req.user.email
        : author || "Anonymous",
      text,
      avatar: avatar || (req.user && req.user.picture) || null,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (req.user.email !== comment.author && req.user.name !== comment.author) {
      const blog = await Blog.findById(comment.blogId);
      if (
        !blog ||
        (req.user.email !== blog.author && req.user.name !== blog.author)
      ) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this comment" });
      }
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
}

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
