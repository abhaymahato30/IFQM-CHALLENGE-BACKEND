const mongoose = require("mongoose");

const externalResourceSchema = new mongoose.Schema({
  label: { type: String, trim: true },
  url: { type: String, trim: true }
});

const solutionSchema = new mongoose.Schema({
  challenge_id: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  submission_date: { type: Date, default: Date.now },

  title: { type: String, required: true, trim: true },
  executive_summary: { type: String, required: true, trim: true },
  primary_approach: { type: String, required: true, trim: true },
  detailed_description: { type: String, required: true, trim: true },
  methodology_and_implementation: { type: String, required: true, trim: true },
  expected_impact: { type: String, required: true, trim: true },

  resources_required: { type: String, default: null, trim: true },
  what_makes_this_different: { type: String, default: null, trim: true },

  supporting_documents: [{ type: String }], // Could be URLs or file references
  external_resources: [externalResourceSchema],

  additional_notes: { type: String, default: null, trim: true },

  ip_ownership_declaration: { type: String, required: true, trim: true },
  collaboration_willingness: { type: Boolean, required: true },

  team_members: [{ type: String, trim: true }],
  visibility: { type: String, enum: ["public", "private"], default: "public" },

  rating: { type: Number, min: 0, max: 5, default: 0 } // optional, add constraints
}, { timestamps: true });

module.exports = mongoose.model("Solution", solutionSchema);
