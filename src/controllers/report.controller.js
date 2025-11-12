const Report = require("../models/Report");

exports.createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ message: "Error reporting content" });
  }
};
