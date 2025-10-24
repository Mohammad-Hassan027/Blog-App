const express = require("express");
const router = express.Router();
const { firebaseAuth } = require("../middleware/authFirebase");
const commentsController = require("../controllers/comments-controller");

router.get("/", firebaseAuth, commentsController.getComments);

router.post("/", firebaseAuth, commentsController.createComment);

router.delete("/:id", firebaseAuth, commentsController.deleteComment);

module.exports = router;
