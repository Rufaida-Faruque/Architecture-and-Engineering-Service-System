const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connectDB = require('./db');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1736;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- FILE UPLOAD ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// --- SCHEMAS (Updated for Member-2 Requirements) ---

const ProjectSchema = new mongoose.Schema({
    clientName: String,
    title: String,
    description: String, // "Comprehensive description"
    budget: Number,
    deadline: String,
    industry: String,
    projectScale: String, // Added: "Small", "Medium", "Large"
    specialRequirements: String,
    files: [String], // "Related files... to clarify needs"
    // "Comments restricted between Client and SPs"
    comments: [{
        authorId: String,
        text: String,
        isPrivate: { type: Boolean, default: true }
    }],
    createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

const ProviderSchema = new mongoose.Schema({
    name: String,
    industry: String,
    rating: Number,
    verified: Boolean,
    // "Showcased projects tagged by category, year, and collaborators"
    portfolio: [{
        title: String,
        year: Number,
        category: String,
        collaborators: String
    }]
});
const ServiceProvider = mongoose.model('ServiceProvider', ProviderSchema);

// --- ROUTES ---

// 1. Post Project (Clients)
app.post('/api/projects', upload.array('projectFiles', 5), async (req, res) => {
    try {
        const filePaths = req.files ? req.files.map(file => file.path) : [];
        const newProject = new Project({ ...req.body, files: filePaths });
        const savedProject = await newProject.save();
        res.status(201).json({ message: "Project posted!", data: savedProject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Browse Projects (For Service Providers)
// Filters: Industry, Budget Range, Project Scale
app.get('/api/projects', async (req, res) => {
    try {
        const { industry, scale, minBudget } = req.query;
        let query = {};

        if (industry) query.industry = { $regex: industry, $options: 'i' };
        if (scale) query.projectScale = scale; // Exact match for "Small", "Medium", etc.
        if (minBudget) query.budget = { $gte: Number(minBudget) };

        const projects = await Project.find(query).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Browse Providers (For Clients)
// Filters: Industry, Verified Status
app.get('/api/providers', async (req, res) => {
    try {
        const { industry, verifiedOnly } = req.query;
        let query = {};

        if (industry) query.industry = { $regex: industry, $options: 'i' };
        if (verifiedOnly === 'true') query.verified = true;

        const providers = await ServiceProvider.find(query);
        res.json(providers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Seed Data (Updated with Portfolio details)
app.post('/api/seed', async (req, res) => {
    await ServiceProvider.create({ 
        name: "ProArchitects Ltd", 
        industry: "Architecture", 
        rating: 4.9, 
        verified: true,
        portfolio: [
            { title: "Skyline Tower", year: 2023, category: "Commercial", collaborators: "BuildCorp" },
            { title: "Green Park", year: 2022, category: "Landscape", collaborators: "CityPlan" }
        ]
    });
    res.send("Dummy data with portfolio added");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});