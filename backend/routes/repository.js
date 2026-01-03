import express from "express";
import Repository from "../models/repository.js";
import User from "../models/user.js";

const router = express.Router();

/*
  CREATE REPOSITORY
  Required:
  - title
  - description
  - createdBy
  - clients (email array)
*/
router.post("/create", async (req, res) => {
  try {
    console.log("CREATE ROUTE HIT");
    console.log("REQ BODY:", req.body);

    const {
      title,
      description,
      createdBy,
      clients,
      collaborators,
      industrySector,
      projectType,
      tags,
      view,
    } = req.body;

    if (!title || !description || !createdBy || !clients || clients.length === 0) {
      return res.status(400).json({
        message: "Title, description, createdBy, and at least one client are required."
      });
    }

    // Convert CLIENT EMAILS → ObjectIds
    const clientUsers = await User.find({ email: { $in: clients } });

    if (clientUsers.length !== clients.length) {
      return res.status(400).json({
        message: "Some client emails do not exist in the system."
      });
    }

    const clientIds = clientUsers.map(u => u._id);

    // Convert COLLAB EMAILS → ObjectIds
    let collaboratorIds = [];
    if (collaborators && collaborators.length > 0) {
      const collabUsers = await User.find({ email: { $in: collaborators } });

      if (collabUsers.length !== collaborators.length) {
        return res.status(400).json({
          message: "Some collaborator emails do not exist in the system."
        });
      }

      collaboratorIds = collabUsers.map(u => u._id);
    }

    // Create the repository
    const newRepo = new Repository({
      title,
      description,
      createdBy,
      clients: clientIds,
      collaborators: collaboratorIds,
      industrySector,
      projectType,
      tags,
      view
    });

    await newRepo.save();

    return res.status(201).json({
      message: "Repository created successfully",
      repo: newRepo
    });

  } catch (err) {
    console.error("ERROR CREATING REPO:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});
router.get("/by-sp", async (req, res) => {
  try {
    const { userId } = req.query;

    const repos = await Repository.find({ createdBy: userId });

    res.json({ repos });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/by-client", async (req, res) => {
  try {
    const { userId } = req.query;

    const repos = await Repository.find({ clients: userId });

    res.json({ repos });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// repositories created by SP
router.get("/by-sp", async (req, res) => {
  try {
    const { userId } = req.query;
    const repos = await Repository.find({ createdBy: userId });
    res.json({ repos });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// repositories where SP is collaborator
router.get("/by-collaborator", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId)
      return res.status(400).json({ message: "userId required" });

    const repos = await Repository.find({
      collaborators: { $in: [userId] }
    });

    res.json({ repos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE REPOSITORY
router.put("/:id", async (req, res) => {
  try {
    const repo = await Repository.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!repo) return res.status(404).json({ message: "Repository not found" });

    res.json({ message: "Repository updated", repo });
  } catch (err) {
    console.error("ERROR UPDATING REPO:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/query", async (req, res) => {
  try {
    const { userId, question } = req.body;

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    repo.queries.push({
      question,
      askedBy: userId,
      seenByClient: true,
      seenBySP: false
    });

    await repo.save();
    res.json({ message: "Query added", repo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id)
      .populate("createdBy", "email role")
      .populate("clients", "email role")
      .populate("collaborators", "email role");

    if (!repo) return res.status(404).json({ message: "Repository not found" });

    res.json({ repo });
  } catch (err) {
    console.error("ERROR FETCHING REPO:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/query/:qIndex/answer", async (req, res) => {
  try {
    const { answer, userId } = req.body;
    const { id, qIndex } = req.params;

    const repo = await Repository.findById(id);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    repo.queries[qIndex].answer = answer;
    repo.queries[qIndex].answeredBy = userId;
    repo.queries[qIndex].seenBySP = true;

    await repo.save();
    res.json({ message: "Query answered", repo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});






// ---------------------------
// Checklist endpoints
// ---------------------------

// Add a task to a section (section: 'todo' | 'ongoing' | 'completed')
router.post("/:id/checklist/add", async (req, res) => {
  try {
    const { userId, task, section } = req.body;
    const allowed = ["todo", "ongoing", "completed"];
    if (!task || !allowed.includes(section)) return res.status(400).json({ message: "Invalid input" });

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Repository not found" });
    if (repo.is_locked) return res.status(403).json({ message: "Repository is locked" });

    // permission: must be creator or collaborator (SP)
    if (!repo.createdBy.equals(userId) && !(repo.collaborators || []).some(c => c.equals(userId))) {
      return res.status(403).json({ message: "Permission denied" });
    }

    repo.checklist[section].push(task);
    await repo.save();
    res.json({ message: "Task added", repo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Move a task from one section to another
router.patch("/:id/checklist/move", async (req, res) => {
  try {
    const { userId, task, from, to } = req.body;
    const allowed = ["todo", "ongoing", "completed"];
    if (!task || !allowed.includes(from) || !allowed.includes(to)) return res.status(400).json({ message: "Invalid input" });

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Not found" });
    if (repo.is_locked) return res.status(403).json({ message: "Repository is locked" });

    if (!repo.createdBy.equals(userId) && !(repo.collaborators || []).some(c => c.equals(userId))) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // remove from source
    const idx = repo.checklist[from].indexOf(task);
    if (idx === -1) return res.status(400).json({ message: "Task not found in source" });
    repo.checklist[from].splice(idx, 1);

    // add to destination
    repo.checklist[to].push(task);
    await repo.save();
    res.json({ message: "Task moved", repo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Remove a task from a section
router.delete("/:id/checklist/remove", async (req, res) => {
  try {
    const { userId, task, section } = req.body;
    const allowed = ["todo", "ongoing", "completed"];
    if (!task || !allowed.includes(section)) return res.status(400).json({ message: "Invalid input" });

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Not found" });
    if (repo.is_locked) return res.status(403).json({ message: "Repository is locked" });

    if (!repo.createdBy.equals(userId) && !(repo.collaborators || []).some(c => c.equals(userId))) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const idx = repo.checklist[section].indexOf(task);
    if (idx === -1) return res.status(400).json({ message: "Task not found" });
    repo.checklist[section].splice(idx, 1);
    await repo.save();
    res.json({ message: "Task removed", repo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// ---------------------------
// Add / Remove clients & collaborators
// ---------------------------

// Add client by email
router.patch("/:id/add-client", async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Not found" });
    if (repo.is_locked) return res.status(403).json({ message: "Repository is locked" });

    // permission: only creator or collaborators (SP) can modify
    if (!repo.createdBy.equals(userId) && !(repo.collaborators || []).some(c => c.equals(userId))) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (repo.clients.some(c => c.equals(user._id))) return res.status(400).json({ message: "Client already added" });

    repo.clients.push(user._id);
    await repo.save();
    res.json({ message: "Client added", repo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Remove client by id
router.patch("/:id/remove-client", async (req, res) => {
  try {
    const { userId, clientId } = req.body;
    if (!clientId) return res.status(400).json({ message: "clientId required" });

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Not found" });
    if (repo.is_locked) return res.status(403).json({ message: "Repository is locked" });

    if (!repo.createdBy.equals(userId) && !(repo.collaborators || []).some(c => c.equals(userId))) {
      return res.status(403).json({ message: "Permission denied" });
    }

    repo.clients = repo.clients.filter(c => !c.equals(clientId));
    await repo.save();
    res.json({ message: "Client removed", repo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Add collaborator by email (must be SP)
router.patch("/:id/add-collaborator", async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Not found" });
    if (repo.is_locked) return res.status(403).json({ message: "Repository is locked" });

    if (!repo.createdBy.equals(userId) && !(repo.collaborators || []).some(c => c.equals(userId))) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.role !== "sp") return res.status(400).json({ message: "User is not a service provider" });

    if (repo.collaborators.some(c => c.equals(user._id))) return res.status(400).json({ message: "Collaborator already added" });

    repo.collaborators.push(user._id);
    await repo.save();
    res.json({ message: "Collaborator added", repo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Remove collaborator by id
router.patch("/:id/remove-collaborator", async (req, res) => {
  try {
    const { userId, collaboratorId } = req.body;
    if (!collaboratorId) return res.status(400).json({ message: "collaboratorId required" });

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Not found" });
    if (repo.is_locked) return res.status(403).json({ message: "Repository is locked" });

    if (!repo.createdBy.equals(userId) && !(repo.collaborators || []).some(c => c.equals(userId))) {
      return res.status(403).json({ message: "Permission denied" });
    }

    repo.collaborators = repo.collaborators.filter(c => !c.equals(collaboratorId));
    await repo.save();
    res.json({ message: "Collaborator removed", repo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// ---------------------------
// Admin lock / approval
// ---------------------------

router.patch("/:id/lock", async (req, res) => {
  try {
    const { adminId } = req.body;
    if (!adminId) return res.status(400).json({ message: "adminId required" });

    const adminUser = await User.findById(adminId);
    if (!adminUser || adminUser.role !== "adm") return res.status(403).json({ message: "Only admin can lock" });

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Not found" });

    repo.is_locked = true;
    repo.approved_by = adminId;
    await repo.save();

    res.json({ message: "Repository locked (approved)", repo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const repos = await Repository.find()
      .populate("createdBy", "email role")
      .populate("clients", "email role")
      .populate("collaborators", "email role");

    res.json({ repos });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all repos shared with a client
router.get("/client/:userId", async (req, res) => {
  try {
    const repos = await Repository.find({
      clients: { $in: [req.params.userId] }
    })
      .populate("createdBy", "email")
      .populate("clients", "email")
      .populate("collaborators", "email");

    return res.json({ repos }); // IMPORTANT: must be { repos }
  } catch (err) {
    console.error("Error loading client repos:", err);
    return res.status(500).json({ message: "Failed to load repos" });
  }
});

router.patch("/:id/request-close", async (req, res) => {
  try {
    const { userId } = req.body;

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    // ONLY the SP creator can request closure
    const isCreator = repo.createdBy.toString() === userId;

    if (!isCreator)
      return res.status(403).json({
        message: "Only the SP owner (creator) can request project closure."
      });

    // Apply request
    repo.requested = true;     // waiting for admin approval
    repo.is_locked = false;    // keep unlocked until admin decides

    await repo.save();

    res.json({ message: "Close request sent to admin.", repo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/:id/request-close", async (req, res) => {
  try {
    const { userId } = req.body;

    const repo = await Repository.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    // ONLY SP OWNER
    if (repo.createdBy.toString() !== userId)
      return res.status(403).json({ message: "Only the SP creator can request closure" });

    repo.requested = true;
    repo.is_locked = false;

    await repo.save();
    res.json({ message: "Close request submitted.", repo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});










export default router;
