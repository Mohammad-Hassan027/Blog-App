const express = require("express");
const multer = require("multer");
const {
  uploadImage,
  deleteImage,
} = require("../controllers/uploads-controller");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// POST /api/uploads - upload an image (field name: file)
router.post("/", upload.single("file"), uploadImage);

// DELETE /api/uploads - delete an image by public_id
router.delete("/", express.json(), deleteImage);

module.exports = router;
