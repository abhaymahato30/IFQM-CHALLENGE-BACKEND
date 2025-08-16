const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: null }, // optional
});

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  brief_description: { type: String, required: true, trim: true },
  detailed_description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },

  current_state: { type: String, required: true, trim: true },
  desired_outcomes: { type: String, required: true, trim: true },

  constraints_requirements: { type: String, default: null },  // optional
  success_metrics: { type: String, default: null },            // optional

  urgency_level: { type: String, required: true, trim: true },
  region_affected: { type: String, default: null, trim: true }, // optional
  desired_timeline: { type: Date, required: true },

  reward_type: { type: String, required: true, trim: true },
  reward_details: { type: String, default: null, trim: true },
  ip_considerations: { type: String, default: null },

  tags: { type: [String], default: [] },

  views: { type: Number, default: 0 },
  solutions_count: { type: Number, default: 0 },
  posted_date: { type: Date, default: Date.now },
  deadline: { type: Date, default: null },

  contact_info: { type: contactInfoSchema, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Challenge", challengeSchema);
