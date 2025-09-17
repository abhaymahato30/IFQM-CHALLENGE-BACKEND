// models/User.js
const mongoose = require("mongoose");

// Achievement sub-schema
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

// User schema
const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true, // Links to Firebase Auth UID
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    skills: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [achievementSchema],
      default: [],
    },
    active_challenges: {
      type: Number,
      default: 0,
    },
    solutions_submitted: {
      type: Number,
      default: 0,
    },
    rewards_earned: {
      type: Number,
      default: 0,
    },
    avg_rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create and export model
module.exports = mongoose.model("User", userSchema);
