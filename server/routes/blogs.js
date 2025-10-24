const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { firebaseAuth } = require("../middleware/authFirebase");
const blogsController = require("../controllers/blogs-controller");
const { Limiter } = require("../middleware/rateLimiters");

// Ensure cross-platform temporary upload directory
const tmpDir = path.join(os.tmpdir(), "blog-app-uploads");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({ dest: tmpDir });

router.get("/", blogsController.getBlogs);

router.get("/my-posts", Limiter, firebaseAuth, blogsController.getMyPosts);

router.get("/:id", Limiter, firebaseAuth, blogsController.getBlogById);

router.post(
  "/",
  Limiter,
  firebaseAuth,
  upload.single("image"),
  blogsController.createBlog
);

router.put(
  "/:id",
  Limiter,
  firebaseAuth,
  upload.single("image"),
  blogsController.updateBlog
);

router.delete("/:id", Limiter, firebaseAuth, blogsController.deleteBlog);

module.exports = router;
