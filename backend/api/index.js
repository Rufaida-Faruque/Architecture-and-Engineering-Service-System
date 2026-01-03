import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "../routes/auth.js";
import repoRoutes from "../routes/repository.js";
import usersRoutes from "../routes/users.js";
import portfolioRoutes from "../routes/portfolio.js";
import postsRouter from "../routes/posts.js";
import bidSessionsRouter from "../routes/bidSessions.js";



const app = express();

/* =========================
   MongoDB serverless connect
========================= */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || undefined
  });

  isConnected = true;
  console.log("MongoDB connected");
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

/* =========================
   Middleware
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   Routes
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/repositories", repoRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/posts", postsRouter);
app.use("/api/bidSessions", bidSessionsRouter);

/* =========================
   Health check
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running 🚀"
  });
});
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
export default app;


