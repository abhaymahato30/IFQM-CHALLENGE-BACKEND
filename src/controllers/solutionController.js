const Solution = require("../models/Solution");
const Comment = require("../models/comment");

// Get all solutions for a challenge
exports.getSolutionsByChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const solutions = await Solution.find({ challenge_id: challengeId })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    res.json(solutions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single solution details
exports.getSolutionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const solution = await Solution.findById(id).populate("user_id", "name email");
    if (!solution) return res.status(404).json({ message: "Solution not found" });

    res.json(solution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- Comments -----------------
exports.getComments = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const comments = await Comment.find({ solution_id: solutionId })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const { text } = req.body;

    // Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    // Create comment without user
    const comment = await Comment.create({
      solution_id: solutionId,
      text: text.trim(),
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Something went wrong while adding the comment." });
  }
};

// Toggle like without user
exports.toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Fetch the comment
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // We'll just increment/decrement a 'likesCount' instead of storing user IDs
    if (!comment.likesCount) comment.likesCount = 0;
    comment.likesCount += 1; // increment for simplicity
    await comment.save();

    res.json({ likesCount: comment.likesCount });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ error: err.message });
  }
};