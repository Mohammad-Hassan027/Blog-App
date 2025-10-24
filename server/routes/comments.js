const express = require("express");
const router = express.Router();
const { firebaseAuth } = require("../middleware/authFirebase");
const commentsController = require("../controllers/comments-controller");
const { Limiter } = require("../middleware/rateLimiters");

router.get("/", firebaseAuth, Limiter, commentsController.getComments);

router.post("/", firebaseAuth, Limiter, commentsController.createComment);

router.delete("/:id", firebaseAuth, Limiter, commentsController.deleteComment);

module.exports = router;
