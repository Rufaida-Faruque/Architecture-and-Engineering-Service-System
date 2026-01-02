import mongoose from "mongoose";

// Portfolio Schema for Service Providers
const serviceProviderPortfolioSchema = new mongoose.Schema({
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (SPs)
    required: true,
  },
  profileDescription: {
    type: String, // Description of the service provider
    required: true,
  },
  skills: {
    type: [String], // Array of skills, e.g., ["JavaScript", "React", "Node.js"]
    required: true,
  },
  expertise: {
    type: [String], // Areas of expertise, e.g., ["Web Development", "UI/UX"]
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically updated when profile is modified
  },
});

// Create the Portfolio model
const Portfolio = mongoose.model("Portfolio", serviceProviderPortfolioSchema);

export default Portfolio;
