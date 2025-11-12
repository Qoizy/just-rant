const express = require("express");
const cors = require("cors");
const rantRoutes = require("./routes/rant.routes");
const commentRoutes = require("./routes/comment.routes");
const reportRoutes = require("./routes/report.routes");
const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: ["https://localhost:5173", ""],
    credentials: true,
  })
);
app.use(express.json());

//routes
app.use("/api/rants", authMiddleware, rantRoutes);
app.use("/api/comments", authMiddleware, commentRoutes);
app.use("/api/reports", authMiddleware, reportRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
