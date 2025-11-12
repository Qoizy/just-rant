const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const contentFilter = require("../middleware/contentFilter");
const {
  addComment,
  getComments,
  deleteComment,
  likeComment,
  unlikeComment,
} = require("../controllers/comment.controller");

router.get("/:id", getComments);
router.post("/:id", auth, contentFilter, addComment);
router.delete("/:commentId", auth, deleteComment);
router.post("/like/:id", auth, likeComment);
router.post("/unlike/:id", auth, unlikeComment);

module.exports = router;
