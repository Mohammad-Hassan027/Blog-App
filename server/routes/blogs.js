const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { firebaseAuth } = require("../middleware/authFirebase");
const blogsController = require("../controllers/blogs-controller");

// Ensure cross-platform temporary upload directory
const tmpDir = path.join(os.tmpdir(), "blog-app-uploads");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({ dest: tmpDir });

// GET /api/blogs - list all PUBLISHED blogs for public view
router.get("/", blogsController.getBlogs);

// GET /api/blogs/my-posts - list all posts for the logged in user
router.get("/my-posts", firebaseAuth, blogsController.getMyPosts);

// GET /api/blogs/:id - get a single blog
router.get("/:id", blogsController.getBlogById);

// POST /api/blogs - create a new blog (requires auth)
router.post(
  "/",
  firebaseAuth,
  upload.single("image"),
  blogsController.createBlog
);

// PUT /api/blogs/:id - update blog (requires auth)
router.put(
  "/:id",
  firebaseAuth,
  upload.single("image"),
  blogsController.updateBlog
);

// DELETE /api/blogs/:id - delete blog (requires auth)
router.delete("/:id", firebaseAuth, blogsController.deleteBlog);

module.exports = router;
