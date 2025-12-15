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

export default router;
