const express = require("express");
const cors = require("cors");
const rantRoutes = require("./routes/rant.routes");
const commentRoutes = require("./routes/comment.routes");
const reportRoutes = require("./routes/report.routes");
const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.get("/test", (req, res) => res.json({ message: "Server is live!" }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://just-rant.onrender.com",
      "https://accounts.google.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// app.options("*", cors());
app.use(express.json());

//routes
app.use("/api/rants", authMiddleware, rantRoutes);
app.use("/api/comments", authMiddleware, commentRoutes);
app.use("/api/reports", authMiddleware, reportRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
