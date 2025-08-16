const express = require("express");
const Challenge = require("../models/Challenge");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  res.json(await Challenge.find());
});

router.get("/:id", async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return res.status(404).json({ error: "Challenge not found" });
  res.json(challenge);
});

router.put("/:id", async (req, res) => {
  res.json(await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", async (req, res) => {
  await Challenge.findByIdAndDelete(req.params.id);
  res.json({ message: "Challenge deleted" });
});

module.exports = router;
