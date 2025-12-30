
import express from 'express';  // Import express
import User from '../models/user.js';  // Import the User model (ensure the '.js' extension)

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill out all fields correctly" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ email, password, role });
    res.status(201).json({
      id: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill out all fields correctly" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {  // No encryption, simple password check
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Send the user ID and role after successful login
    res.status(200).json({
      id: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;  // Export the router to use in app.js
