const express = require("express");
const router = express.Router();
const { firebaseAuth } = require("../middleware/authFirebase");
const commentsController = require("../controllers/comments-controller");

// GET /api/comments?blogId=... - list comments for a blog
router.get("/", commentsController.getComments);

// POST /api/comments - create comment (optional auth)
router.post("/", firebaseAuth, commentsController.createComment);

// DELETE /api/comments/:id - delete comment (requires auth)
router.delete("/:id", firebaseAuth, commentsController.deleteComment);

module.exports = router;
