const express = require("express");
const router = express.Router();
const { firebaseAuth } = require("../middleware/authFirebase");
const commentsController = require("../controllers/comments-controller");
const { Limiter } = require("../middleware/rateLimiters");

router.get("/", firebaseAuth, commentsController.getComments);

router.post("/", Limiter, firebaseAuth, commentsController.createComment);

router.delete("/:id", Limiter, firebaseAuth, commentsController.deleteComment);

module.exports = router;
