const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------
// Requirement: Port must be last 4 digits of ID (22201736)
const PORT = 1736; 

// Middleware
app.use(cors());
app.use(express.json());

// ------------------------------------------------------------
// DATABASE CONNECTION
// ------------------------------------------------------------
// Connects to a local MongoDB database named 'arch_engineering_db'
mongoose.connect('mongodb://127.0.0.1:27017/arch_engineering_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// ------------------------------------------------------------
// MONGOOSE MODELS (Schemas)
// ------------------------------------------------------------

// 1. Project Schema (For Feature 1: Posting Project Requirements)
const ProjectSchema = new mongoose.Schema({
    clientName: String,
    projectTitle: String,
    description: String,
    budget: Number,
    deadline: String,
    specialRequirements: String,
    createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// 2. Service Provider Schema (For Feature 2: Browsing Providers)
const ProviderSchema = new mongoose.Schema({
    name: String,
    industry: String, // e.g., "Interior Design", "Architecture"
    minBudget: Number,
    rating: Number,
    verified: Boolean
});
const ServiceProvider = mongoose.model('ServiceProvider', ProviderSchema);

// ------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------

// === FEATURE 1: Post Project Requirements ===
// Description: Clients post detailed project requirements including budget and deadline.
app.post('/api/projects/create', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(201).json({
            message: "Project Posted Successfully",
            data: savedProject
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === FEATURE 2: Browse Service Providers ===
// Description: Clients search for providers filtering by industry and budget range.
app.get('/api/providers/search', async (req, res) => {
    try {
        const { industry, maxBudget } = req.query;

        let query = {};
        
        // Apply Industry Filter if provided
        if (industry) {
            query.industry = { $regex: industry, $options: 'i' }; // Case-insensitive search
        }

        // Apply Budget Filter (find providers whose minimum budget is within client's max budget)
        if (maxBudget) {
            query.minBudget = { $lte: Number(maxBudget) };
        }

        const providers = await ServiceProvider.find(query);
        
        res.status(200).json({
            count: providers.length,
            results: providers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === SEED ROUTE (Optional Helper) ===
// Run this once to add some dummy providers to the database so Feature 2 has data to find.
app.post('/api/seed-providers', async (req, res) => {
    const dummyData = [
        { name: "Alpha Construction", industry: "Construction", minBudget: 50000, rating: 4.5, verified: true },
        { name: "Creative Interiors", industry: "Interior Design", minBudget: 10000, rating: 4.8, verified: true },
        { name: "Green Landscape", industry: "Landscape", minBudget: 5000, rating: 4.2, verified: true }
    ];
    await ServiceProvider.insertMany(dummyData);
    res.send("Dummy providers added!");
});

// ------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server running for Student 22201736 on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}`);
});