
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI first 20 chars:', process.env.MONGODB_URI?.substring(0, 20));


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message))
  .finally(() => {
    console.log('🚀 Starting server...');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });