const Comment = require("../models/Comment");
const Rant = require("../models/Rant");
const generateName = require("../utils/randomNameGenerator");

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const comment = await Comment.create({
      rantId: id,
      displayName: generateName(),
      content,
      createdBy: req.user.id,
    });

    await Rant.findByIdAndUpdate(id, { $inc: { commentCount: 1 } });
    res.status(201).json(comment);
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Error posting comment" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ rantId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });

    await comment.deleteOne({ _id: id });

    await Rant.findByIdAndUpdate(comment.rantId, {
      $inc: { commentCount: -1 },
    });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ message: "Error deleting comment" });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.likes = comment.likes || [];

    if (comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You've already liked this comment" });

      comment.likes.push(userId);
      await comment.save();

      res.json({ message: "Comment liked", likesCount: comment.likes.length });
    }
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({ message: "Error liking message" });
  }
};

exports.unlikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(400).json({ message: "Comment not found" });

    comment.likes = comment.likes || [];

    if (!comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have not liked this comment" });
    }

    comment.likes = comment.likes.filter((uid) => uid.toString() !== userId);
    await comment.save();

    res.json({ message: "Comment unliked", likesCount: comment.likes.length });
  } catch (error) {
    console.error("Unlike comment error:", error);
    res.status(500).json({ message: "Error unliking comment" });
  }
};
