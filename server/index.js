require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const blogsRouter = require("./routes/blogs");
const commentsRouter = require("./routes/comments");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" })
);

// routes
app.use("/api/blogs", blogsRouter);
app.use("/api/comments", commentsRouter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
