const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    rantId: { type: mongoose.Schema.Types.ObjectId, ref: "Rant" },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
