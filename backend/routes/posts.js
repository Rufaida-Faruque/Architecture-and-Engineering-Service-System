import express from "express";
import Post from "../models/post.js";

const router = express.Router();

// GET ALL POSTS CREATED BY CLIENT
router.get("/client/:clientId", async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.params.clientId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error loading posts" });
  }
});

export default router;
