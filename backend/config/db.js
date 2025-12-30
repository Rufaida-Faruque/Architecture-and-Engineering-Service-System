// // backend/db.js
// const mongoose = require('mongoose');
// require('dotenv').config(); // To read environment variables from .env file

// // MongoDB connection logic
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI); // No need for additional options
//     console.log(`✅ MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error.message);
//     process.exit(1); // Exit the process if connection fails
//   }
// };

// // Export connectDB function to use in app.js
// module.exports = connectDB;
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1); // Exit the process with a failure code
  }
};
