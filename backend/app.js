
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from './routes/auth.js';
import repoRoutes from './routes/repository.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();

// Fix ES module path usage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repositories', repoRoutes);
app.use('/api/users', usersRoutes);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


import postsRouter from "./routes/posts.js";
import bidSessionsRouter from "./routes/bidSessions.js";

app.use("/api/posts", postsRouter);
app.use("/api/bidSessions", bidSessionsRouter);


import googleAuth from "./routes/google.js";
app.use("/api/google", googleAuth);










