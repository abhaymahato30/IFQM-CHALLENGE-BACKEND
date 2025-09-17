const express = require("express");
const Solution = require("../models/Solution");
const router = express.Router();
const solutionController = require("../controllers/solutionController");
const verifyFirebaseToken = require("../middleware/authMiddleware");

// -------------------- SOLUTIONS --------------------

// Get all solutions for a specific challenge
router.get("/challenge/:challengeId", async (req, res) => {
  try {
    console.log("Fetching solutions for challengeId:", req.params.challengeId);
    const solutions = await Solution.find({ challenge_id: req.params.challengeId })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    console.log("Solutions fetched:", solutions.length);
    res.json(solutions); // Always return an array
  } catch (err) {
    console.error("Error fetching solutions:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get single solution details
router.get("/details/:id", async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate("user_id", "name email")
      .populate("challenge_id", "title");

    if (!solution) return res.status(404).json({ error: "Solution not found" });
    res.json(solution);
  } catch (err) {
    console.error("Error fetching solution details:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new Solution
router.post("/", async (req, res) => {
  try {
    const solution = await Solution.create(req.body);
    res.status(201).json(solution);
  } catch (err) {
    console.error("Error creating solution:", err);
    res.status(400).json({ error: err.message });
  }
});

// Update a Solution
router.put("/:id", async (req, res) => {
  try {
    const updatedSolution = await Solution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSolution) return res.status(404).json({ error: "Solution not found" });
    res.json(updatedSolution);
  } catch (err) {
    console.error("Error updating solution:", err);
    res.status(400).json({ error: err.message });
  }
});

// Delete a Solution
router.delete("/:id", async (req, res) => {
  try {
    const deletedSolution = await Solution.findByIdAndDelete(req.params.id);
    if (!deletedSolution) return res.status(404).json({ error: "Solution not found" });
    res.json({ message: "Solution deleted" });
  } catch (err) {
    console.error("Error deleting solution:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- COMMENTS --------------------

// Get all comments for a solution
router.get("/:solutionId/comments", solutionController.getComments);

// Add a comment
router.post("/:solutionId/comments",  solutionController.addComment);

// Like/unlike a comment
router.post("/comments/:commentId/like", solutionController.toggleLikeComment);

// -------------------- ALL SOLUTIONS --------------------

// Optional: Get all solutions (for admin or debug)
router.get("/", async (req, res) => {
  try {
    const solutions = await Solution.find()
      .populate("challenge_id", "title")
      .populate("user_id", "name email");
    res.json(solutions);
  } catch (err) {
    console.error("Error fetching all solutions:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
