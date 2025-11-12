module.exports = function (req, res, next) {
  const text = (req.body.content || "").toLowerCase();

  const banned = ["kill", "hate", "attack", "stupid", "idiot"];
  const containsBad = banned.some((word) => text.includes(word));

  if (containsBad) {
    return res
      .status(400)
      .json({ message: "Your content violate community guidelines." });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /\d{10,}/;

  if (emailRegex.test(text) || phoneRegex.test(text)) {
    return res.status(400).json({ Message: "Do not post personal stuff." });
  }

  next();
};
