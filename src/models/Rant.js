const mongoose = require("mongoose");

const RantSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    commentCount: { type: Number, default: 0 },
    isFlagged: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rant", RantSchema);
