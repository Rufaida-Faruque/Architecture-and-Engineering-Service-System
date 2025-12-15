import express from "express";
import BidSession from "../models/bidSession.js";

const router = express.Router();

// GET ALL BID SESSIONS CREATED BY CLIENT
router.get("/client/:clientId", async (req, res) => {
  try {
    const bids = await BidSession.find({ createdBy: req.params.clientId });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: "Error loading bid sessions" });
  }
});

export default router;
