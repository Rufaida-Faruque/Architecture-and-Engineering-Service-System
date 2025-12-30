import express from "express";
import User from "../models/user.js";

const router = express.Router();

// GET /api/users/find-by-email?email=...
router.get("/find-by-email", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});




router.get("/find-by-id", async (req, res) => {
  try {
    const userId = req.query.userId;  // Get the userId from the query string
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    // Find the user by their userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's email
    res.status(200).json({ email: user.email });  // Return only the email
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: "Server error" });
  }
});






export default router;
