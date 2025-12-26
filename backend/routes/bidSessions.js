import express from "express";
import BidSession from "../models/bidSession.js";
import User from "../models/user.js";

const router = express.Router();




// Handle POST request to create a bid session
// router.post("/create", async (req, res) => {
//   try {
//     const { title, description, allowBidVisibility, clientId } = req.body;

//     if (!title || !clientId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Authentication logic
//     const client = await User.findById(clientId);
//     if (!client || client.role !== "cl") {
//       return res.status(403).json({ message: "Only clients can create bid sessions" });
//     }

//     // Create bid session logic
//     const session = new BidSession({
//       title,
//       description,
//       allowBidVisibility,
//       client: clientId
//     });

//     await session.save();

//     res.status(201).json({
//       message: "Bid session created",
//       session
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });















// router.post("/create", async (req, res) => {
//   try {
//     const { title, description, amount, allowBidVisibility, clientId, hasTimer, duration } = req.body;

//     if (!title || !clientId || !amount) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const client = await User.findById(clientId);
//     if (!client || client.role !== "cl") {
//       return res.status(403).json({ message: "Only clients can create bid sessions" });
//     }

//     // Create bid session with amount and timer if set
//     const session = new BidSession({
//       title,
//       description,
//       amount,  // Store the amount set by the client
//       allowBidVisibility,
//       client: clientId,
//       status: "open",  // Set session status to open initially
//       hasTimer,
//       duration: hasTimer ? duration : null,  // Store the duration if the timer is set
//     });

//     await session.save();

//     // If a timer is set, handle session auto-close logic (on backend or using a cron job)
//     if (hasTimer) {
//       // Assuming you have a method to handle the auto-close logic
//       setTimeout(async () => {
//         session.status = "closed"; // Automatically close the session after the specified duration
//         await session.save();
//         console.log(`Bid session ${session._id} closed automatically after timer.`);
//       }, duration * 60 * 60 * 1000);  // Convert hours to milliseconds
//     }

//     res.status(201).json({
//       message: "Bid session created",
//       session,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });










// router.post("/create", async (req, res) => {
//   try {
//     const { title, description, amount, allowBidVisibility, clientId, hasTimer, duration } = req.body;

//     if (!title || !clientId || !amount) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const client = await User.findById(clientId);
//     if (!client || client.role !== "cl") {
//       return res.status(403).json({ message: "Only clients can create bid sessions" });
//     }

//     // Create bid session with amount, visibility, and timer if set
//     const session = new BidSession({
//       title,
//       description,
//       amount,  // Store the amount set by the client
//       allowBidVisibility, // Store visibility setting
//       client: clientId,
//       status: "open",  // Set session status to open initially
//       hasTimer,
//       duration: hasTimer ? duration : null,  // Store the duration if the timer is set
//     });

//     await session.save();

//     // If a timer is set, handle session auto-close logic (on backend or using a cron job)
//     if (hasTimer) {
//       const durationInHours = duration * 24;  // Convert days to hours
//       setTimeout(async () => {
//         session.status = "closed"; // Automatically close the session after the specified duration
//         await session.save();
//         console.log(`Bid session ${session._id} closed automatically after timer.`);
//       }, durationInHours * 60 * 60 * 1000);  // Convert hours to milliseconds
//     }

//     res.status(201).json({
//       message: "Bid session created",
//       session,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.post("/create", async (req, res) => {
  try {
    const { title, description, amount, allowBidVisibility, clientId, hasTimer, duration } = req.body;

    if (!title || !clientId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await User.findById(clientId);
    if (!client || client.role !== "cl") {
      return res.status(403).json({ message: "Only clients can create bid sessions" });
    }

    // Create bid session with amount, visibility, and timer if set
    const session = new BidSession({
      title,
      description,
      amount,  // Store the amount set by the client
      allowBidVisibility, // Store visibility setting
      client: clientId,
      status: "open",  // Set session status to open initially
      hasTimer,
      duration: hasTimer ? duration : null,  // Store the duration if the timer is set
    });

    await session.save();

    // If a timer is set, handle session auto-close logic (on backend or using a cron job)
    if (hasTimer) {
      const durationInHours = duration * 24;  // Convert days to hours
      setTimeout(async () => {
        session.status = "closed"; // Automatically close the session after the specified duration
        await session.save();
        console.log(`Bid session ${session._id} closed automatically after timer.`);
      }, durationInHours * 60 * 60 * 1000);  // Convert hours to milliseconds
    }

    res.status(201).json({
      message: "Bid session created",
      session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});





















//View Own Bid Sessions
router.get("/client/:clientId", async (req, res) => {
  try {
    const sessions = await BidSession.find({
      client: req.params.clientId
    }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Failed to load sessions" });
  }
});






//View Own Bid Sessions



// router.get("/open", async (req, res) => {
//   try {
//     const sessions = await BidSession.find({ status: "open" })
//       .populate("client", "email")
//       .sort({ createdAt: -1 });

//     res.json(sessions);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load open sessions" });
//   }
// });



// Fetch open sessions where the SP has not participated yet
router.get("/open", async (req, res) => {
  try {
    const sessions = await BidSession.find({ status: "open" })
      .populate("client", "email") // Optional: populate client email
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load open sessions" });
  }
});

// Fetch sessions the SP has participated in
router.get("/sp/:spId", async (req, res) => {
  try {
    const spId = req.params.spId; // Extract SP ID from URL parameters
    const sessions = await BidSession.find({ "bids.sp": spId }) // Find sessions where SP has placed a bid
      .populate("client", "email") // Optional: populate client email
      .sort({ createdAt: -1 });

    res.status(200).json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load participated sessions" });
  }
});













// Route to fetch a specific bid session by ID (with bids included)
router.get("/:sessionId", async (req, res) => {
  try {
    const session = await BidSession.findById(req.params.sessionId)
      .populate('bids.sp', 'email') // Populate SP email in the bids
      .populate('client', 'email'); // Populate client email if needed

    if (!session) {
      return res.status(404).json({ message: "Bid session not found" });
    }

    res.status(200).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




// CLOSE SESSION (no auth)
// Route to close the bid session
router.put("/:sessionId/close", async (req, res) => {
  try {
    const { clientId } = req.body; // The client who is trying to close the session

    if (!clientId) {
      return res.status(400).json({ message: "clientId is required" });
    }

    const session = await BidSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Bid session not found" });
    }

    // Only the client who created the session can close it
    if (session.client.toString() !== clientId.toString()) {
      return res.status(403).json({ message: "Unauthorized. Only the owner client can close this session" });
    }

    // Prevent closing if the session is already closed
    if (session.status === "closed") {
      return res.status(400).json({ message: "This session is already closed" });
    }

    // Update the session status to closed
    session.status = "closed";
    await session.save(); // Save the session with the updated status

    res.status(200).json({ message: "Bid session closed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// DELETE SESSION (no auth)
router.delete("/:sessionId", async (req, res) => {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      return res.status(400).json({ message: "clientId is required" });
    }

    const session = await BidSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: "Bid session not found" });

    // Only owner client can delete
    if (session.client.toString() !== clientId.toString()) {
      return res.status(403).json({ message: "Unauthorized. Only owner client can delete this session" });
    }

    if (session.status === "closed") {
      return res.status(400).json({ message: "Cannot delete a closed bid session" });
    }

    await session.deleteOne();
    res.status(200).json({ message: "Bid session deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// // SELECT WINNER (no auth) - also should be protected
// router.put("/:sessionId/select-winner", async (req, res) => {
//   try {
//     const { winnerId, clientId } = req.body;

//     if (!clientId || !winnerId) {
//       return res.status(400).json({ message: "clientId and winnerId are required" });
//     }

//     const session = await BidSession.findById(req.params.sessionId);
//     if (!session) return res.status(404).json({ message: "Bid session not found" });

//     if (session.client.toString() !== clientId.toString()) {
//       return res.status(403).json({ message: "Unauthorized. Only owner client can select winner" });
//     }

//     if (session.status !== "closed") {
//       return res.status(400).json({ message: "Session must be closed to select a winner" });
//     }

//     const exists = session.bids.find(b => b.sp.toString() === winnerId.toString());
//     if (!exists) return res.status(400).json({ message: "Invalid winner selection" });

//     session.winner = winnerId;
//     await session.save();

//     res.status(200).json({ message: "Winner selected successfully", session });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });




// // Route to select a winner (only after the session is closed)
// router.put("/:sessionId/select-winner", async (req, res) => {
//   try {
//     const { winnerId, clientId } = req.body; // The ID of the selected winner and the clientId

//     const session = await BidSession.findById(req.params.sessionId);

//     if (!session) {
//       return res.status(404).json({ message: "Bid session not found" });
//     }

//     // Ensure the session is closed before selecting a winner
//     if (session.status !== "closed") {
//       return res.status(400).json({ message: "Session must be closed to select a winner" });
//     }

//     // Ensure that the winner can only be selected once and cannot be changed after that
//     if (session.winner) {
//       return res.status(400).json({ message: "Winner has already been selected. It cannot be changed." });
//     }

//     // Find the selected winner and check if the winner exists
//     const winner = session.bids.find(bid => bid.sp.toString() === winnerId);
//     if (!winner) {
//       return res.status(400).json({ message: "Invalid winner selection" });
//     }

//     // Set the winner in the session
//     session.winner = winnerId;
//     await session.save();

//     res.status(200).json({ message: "Winner selected successfully", session });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Route to select a winner (only after the session is closed)
router.put("/:sessionId/select-winner", async (req, res) => {
  try {
    const { winnerId, clientId } = req.body; // The ID of the selected winner and the clientId

    const session = await BidSession.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({ message: "Bid session not found" });
    }

    // Ensure the session is closed before selecting a winner
    if (session.status !== "closed") {
      return res.status(400).json({ message: "Session must be closed to select a winner" });
    }

    // Ensure that the winner can only be selected once and cannot be changed after that
    if (session.winner) {
      return res.status(400).json({ message: "Winner has already been selected. It cannot be changed." });
    }

    // Find the selected winner and check if the winner exists
    const winner = session.bids.find(bid => bid.sp.toString() === winnerId);
    if (!winner) {
      return res.status(400).json({ message: "Invalid winner selection" });
    }

    // Set the winner in the session
    session.winner = winnerId;
    await session.save();

    // Populate the session with the winner's email
    const populatedSession = await BidSession.findById(req.params.sessionId)
      .populate("winner", "email") // Populate the winner's email
      .populate("client", "email");

    res.status(200).json({ message: "Winner selected successfully", session: populatedSession });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Route to delete a specific bid
router.delete("/:sessionId/bid/:bidId", async (req, res) => {
  try {
    const { sessionId, bidId } = req.params;

    // Find the session
    const session = await BidSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Remove the bid from the session's bids array
    const bidIndex = session.bids.findIndex((bid) => bid._id.toString() === bidId);
    if (bidIndex === -1) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // Remove the bid from the array
    session.bids.splice(bidIndex, 1);
    await session.save(); // Save the updated session

    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (err) {
    console.error("Error deleting bid:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Example: GET /api/bidSessions/open
router.get("/open", async (req, res) => {
  try {
    const sessions = await BidSession.find({ status: "open" });  // Find open sessions
    res.status(200).json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch open bid sessions" });
  }
});

// // Route to place a bid


router.post("/:sessionId/bid", async (req, res) => {
  try {
    const { amount, statement } = req.body;
    const sessionId = req.params.sessionId;
    const spId = req.body.spId; // SP ID from the frontend

    // Validate that amount and statement are provided
    if (!amount || !statement) {
      return res.status(400).json({ message: "Amount and statement are required" });
    }

    // Check if the session exists
    const session = await BidSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Ensure the session is open before allowing bids
    if (session.status === "closed") {
      return res.status(400).json({ message: "This session is closed and no longer accepting bids" });
    }

    // Create a new bid object
    const bid = {
      sp: spId,  // SP's ID
      amount,    // The bid amount
      statement, // The comment/statement for the bid
      updatedAt: Date.now(),
    };

    // Check if the SP has already placed a bid
    const existingBid = session.bids.find(bid => bid.sp.toString() === spId.toString());
    if (existingBid) {
      // If an existing bid exists, update it
      existingBid.amount = amount;
      existingBid.statement = statement;
    } else {
      // If no bid exists, create a new one
      session.bids.push(bid);
    }

    // Save the session with the updated bid data
    await session.save();

    res.status(201).json({ message: "Bid placed/updated successfully", bid });
  } catch (err) {
    console.error("Error placing bid:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});













// Route to get the bids based on visibility settings
router.get("/:sessionId/bids", async (req, res) => {
  try {
    const session = await BidSession.findById(req.params.sessionId).populate("bids.sp", "email"); // Populate SP email in bids
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if the bid visibility is allowed
    if (session.allowBidVisibility) {
      return res.status(200).json(session.bids); // If visibility is true, show all bids
    }

    // Otherwise, return only the SP's own bid
    const userId = req.user._id; // Assuming `req.user._id` holds the logged-in user's ID
    const ownBid = session.bids.filter(bid => bid.sp.toString() === userId.toString());
    return res.status(200).json(ownBid); // Return only the SP's bid

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;