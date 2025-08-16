const express = require("express");
const Solution = require("../models/Solution");
const router = express.Router();

// Create a new Solution
router.post("/", async (req, res) => {
  try {
    const solution = await Solution.create(req.body);
    res.status(201).json(solution);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Solutions
router.get("/", async (req, res) => {
  try {
    const solutions = await Solution.find()
      .populate("challenge_id", "title")
      .populate("user_id", "name email");
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Solution by ID
router.get("/:id", async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate("challenge_id", "title")
      .populate("user_id", "name email");
    if (!solution) return res.status(404).json({ error: "Solution not found" });
    res.json(solution);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
