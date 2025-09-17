const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    solution_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Solution",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      default: "No comment provided",
    },
    likes: {
      type: [String], // store user IDs as strings if needed, or leave empty
      default: [],
    },
     likesCount: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
