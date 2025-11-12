const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ token, username: user.username });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ mssage: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid crendentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};
