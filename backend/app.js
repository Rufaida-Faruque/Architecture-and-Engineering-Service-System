
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
// console.log('MONGODB_URI first 20 chars:', process.env.MONGODB_URI?.substring(0, 20));


// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ MongoDB Atlas connected'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err.message))
//   .finally(() => {
//     console.log('🚀 Starting server...');
//     const PORT = process.env.PORT || 4000;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   });

import express from 'express';   // Import express using ES module syntax
import dotenv from 'dotenv';    // Import dotenv to handle environment variables
import mongoose from 'mongoose'; // Import mongoose for MongoDB connection
import cors from 'cors';         // Import CORS to allow cross-origin requests
import authRoutes from './routes/auth.js'; // Import your authentication routes (ensure to include '.js' extension)

dotenv.config();  // Load environment variables from the .env file

const app = express();

// Enable CORS for all origins (you can limit this to a specific domain if needed)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Use the authentication routes (e.g., /api/auth/register)
app.use('/api/auth', authRoutes);

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
