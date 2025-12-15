import mongoose from "mongoose";

const BidSessionSchema = new mongoose.Schema({
  title: String,
  budget: Number,
  maxAmount: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("BidSession", BidSessionSchema);
