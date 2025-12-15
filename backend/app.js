
// import express from 'express';   // Import express using ES module syntax
// import dotenv from 'dotenv';    // Import dotenv to handle environment variables
// import mongoose from 'mongoose'; // Import mongoose for MongoDB connection
// import cors from 'cors';         // Import CORS to allow cross-origin requests
// import authRoutes from './routes/auth.js'; // Import your authentication routes (ensure to include '.js' extension)


// dotenv.config();  // Load environment variables from the .env file

// const app = express();

// // Enable CORS for all origins (you can limit this to a specific domain if needed)
// app.use(cors());

// // Middleware to parse incoming JSON requests
// app.use(express.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB connection error:", err));

// // Use the authentication routes (e.g., /api/auth/register)
// app.use('/api/auth', authRoutes);

// // Start the server on the specified port
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// import repoRoutes from "./routes/repository.js";
// app.use("/api/repositories", repoRoutes);


// import usersRoutes from "./routes/users.js";
// app.use("/api/users", usersRoutes);

// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
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

