const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    rantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rant",
      requires: true,
    },
    displayName: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
