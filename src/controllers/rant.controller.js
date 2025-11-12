const mongoose = require("mongoose");
const Rant = require("../models/Rant");
const Comment = require("../models/Comment");
const generateName = require("../utils/randomNameGenerator");

exports.createRant = async (req, res) => {
  try {
    const { category, content } = req.body;

    const rant = await Rant.create({
      displayName: generateName(),
      category,
      content,
      createdBy: req.user.id,
      //   likes: [],
    });
    res.status(201).json(rant);
  } catch (err) {
    console.error("Create rant error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getRants = async (req, res) => {
  try {
    const { category } = req.query;
    const userId = req.user?.id;
    const query = category ? { category } : {};

    const rants = await Rant.find(query)
      .sort({ createdAt: -1 })
      .select("-createdBy -__v");

    const rantsWithLikes = rants.map((rant) => ({
      ...rant.toObject(),
      likesCount: rant.likes ? rant.likes.length : 0,
      likedByUser: userId ? rant.likes?.includes(userId) : false,
    }));

    res.json(rantsWithLikes);
  } catch (err) {
    console.error("Get rant error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRantById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const rant = await Rant.findById(req.params.id).select("-crreatdBy -__v");
    if (!rant) return res.status(404).json({ message: "Rant not found" });

    res.json(rant);
  } catch {
    res.status(404).json({ message: "Rant not found" });
  }
};

exports.getRantWithComments = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const rant = await Rant.findById(id).lean().select("-createdBy -__v");
    if (!rant) return res.status(404).json({ message: "Rant not found" });

    const comments = await Comment.find({ rantId: id })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .select("-__v -userId.password")
      .lean();

    const commentsWithLikes = comments.map((comment) => ({
      ...comments,
      likesCount: comments.likes ? comments.likes.length : 0,
      likedByUser: userId ? comments.likes?.includes(userId) : false,
    }));

    const rantWithLikes = {
      ...rant,
      likesCount: rant.likes ? rant.likes.length : 0,
      likedByUser: userId ? rant.likes?.includes(userId) : false,
      comments: commentsWithLikes,
    };

    res.json({ rantWithLikes });
  } catch (err) {
    console.error("GET RANT WITH COMMENTS ERROR:", err);
    res
      .status(500)
      .json({ message: "Error fetching rant", error: err.message });
  }
};

exports.deleteRant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" });

    const rant = await Rant.findById(id);
    if (!rant) return res.status(400).json({ message: "Rant not found" });

    if (rant.createdBy.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this rant" });

    await Comment.deleteMany({ rantId: rant._id });
    await Rant.deleteOne({ _id: rant._id });

    res.json({ message: "Rant deleted successfully" });
  } catch (err) {
    console.log("DELETE RANT ERROR:", err);
    res.status(500).json({ message: "Error deleting rant" });
  }
};

exports.likeRant = async (req, res) => {
  try {
    const { id } = req.params; // rant ID
    const userId = req.user.id;

    const rant = await Rant.findById(id);
    if (!rant) return res.status(404).json({ message: "Rant not found" });

    rant.likes = rant.likes || [];

    if (rant.likes.includes(userId)) {
      return res.status(400).json({ message: "You already liked this rant" });
    }

    rant.likes.push(userId);
    await rant.save();

    res.json({ message: "Rant liked", likesCount: rant.likes.length });
  } catch (err) {
    console.error("LIKE RANT ERROR:", err);
    res.status(500).json({ message: "Error liking rant" });
  }
};

exports.unlikeRant = async (req, res) => {
  try {
    const { id } = req.params; // rant ID
    const userId = req.user.id;

    const rant = await Rant.findById(id);
    if (!rant) return res.status(404).json({ message: "Rant not found" });

    rant.likes = rant.likes || [];

    if (!rant.likes.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this rant" });
    }

    rant.likes = rant.likes.filter((uid) => uid.toString() !== userId);
    await rant.save();

    res.json({ message: "Rant unliked", likesCount: rant.likes.length });
  } catch (err) {
    console.error("UNLIKE RANT ERROR:", err);
    res.status(500).json({ message: "Error unliking rant" });
  }
};
