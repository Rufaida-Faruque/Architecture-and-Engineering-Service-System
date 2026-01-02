import express from 'express';
import Portfolio from '../models/portfolio.js';
import User from '../models/user.js'; // User model to check the user's role



const router = express.Router();

// // Middleware to check if the user is a Service Provider (SP)
// const isServiceProvider = async (req, res, next) => {
//   const user = await getUserFromSession(req); // Assuming user data is in the session or request

//   if (!user || user.role !== 'sp') {
//     return res.status(403).json({ message: 'Only Service Providers can create portfolios' });
//   }
//   req.user = user; // Attach user data to the request
//   next(); // Proceed to the next middleware or route handler
// };

// Route to create a portfolio
router.post('/create',  async (req, res) => {
  const { profileDescription, skills, expertise } = req.body;

  try {
    // Check if the Service Provider already has a portfolio
    const existingPortfolio = await Portfolio.findOne({ serviceProviderId: req.user._id });
    if (existingPortfolio) {
      return res.status(400).json({ message: 'Portfolio already exists for this Service Provider' });
    }

    // Create new portfolio
    const newPortfolio = new Portfolio({
      serviceProviderId: req.user._id,
      profileDescription,
      skills,
      expertise,
    });

    await newPortfolio.save();
    res.status(201).json({ message: 'Portfolio created successfully', portfolio: newPortfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating portfolio' });
  }
});

// Route to view the portfolio of the logged-in Service Provider
router.get('/',  async (req, res) => {
  try {
    // Fetch the portfolio for the logged-in Service Provider
    const portfolio = await Portfolio.findOne({ serviceProviderId: req.user._id });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.status(200).json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
});

export default router;
