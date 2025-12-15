import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  mimetype: String,
  size: Number,
  url: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});

const querySchema = new mongoose.Schema({
  question: String,
  answer: String,
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  seenByClient: { type: Boolean, default: false },
  seenBySP: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const repositorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  industrySector: { type: String, default: "" },
  projectType: { type: String, default: "" },
  tags: { type: [String], default: [] },

  queries: { type: [querySchema], default: [] },

  checklist: {
    todo: { type: [String], default: [] },
    ongoing: { type: [String], default: [] },
    completed: { type: [String], default: [] }
  },

  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },

  is_locked: { type: Boolean, default: false },
  requested: { type: Boolean, default: false },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  view: { type: String, enum: ["public", "private"], default: "private" },

  documents: { type: [fileSchema], default: [] },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});



export default mongoose.model("Repository", repositorySchema);
