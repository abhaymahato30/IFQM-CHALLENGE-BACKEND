const Challenge = require("../models/Challenge");
const User = require("../models/User");

// -------------------------
// Create a new challenge
// -------------------------
exports.createChallenge = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.firebaseUid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const challenge = await Challenge.create({
      ...req.body,
      createdBy: user._id,
      status: "pending", // new challenges are pending by default
    });

    res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    console.error("createChallenge Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// -------------------------
// Get all approved challenges (public)
// -------------------------
exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: "approved" });
    res.json({ success: true, data: challenges });
  } catch (err) {
    console.error("getAllChallenges Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// -------------------------
// Get challenge by ID
// -------------------------
exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || challenge.status !== "approved") {
      return res.status(404).json({ error: "Challenge not found" });
    }
    res.json({ success: true, data: challenge });
  } catch (err) {
    console.error("getChallengeById Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// -------------------------
// Update challenge (creator or admin)
// -------------------------
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    if (challenge.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    Object.assign(challenge, req.body);
    const updatedChallenge = await challenge.save();
    res.json({ success: true, data: updatedChallenge });
  } catch (err) {
    console.error("updateChallenge Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// -------------------------
// Delete challenge (creator or admin)
// -------------------------
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    if (challenge.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await challenge.remove();
    res.json({ success: true, message: "Challenge deleted" });
  } catch (err) {
    console.error("deleteChallenge Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ========================
// ADMIN: Get all pending challenges
// ========================
exports.getPendingChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: "pending" })
      .populate("createdBy", "name email");
    res.json({ success: true, data: challenges });
  } catch (err) {
    console.error("getPendingChallenges Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ========================
// ADMIN: Approve challenge
// ========================
exports.approveChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    challenge.status = "approved";
    challenge.approvedBy = req.user.id;
    await challenge.save();

    res.json({ success: true, message: "Challenge approved", data: challenge });
  } catch (err) {
    console.error("approveChallenge Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ========================
// ADMIN: Reject challenge
// ========================
exports.rejectChallenge = async (req, res) => {
  try {
    const { reason } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });

    challenge.status = "rejected";
    challenge.rejectionReason = reason || "No reason provided";
    challenge.approvedBy = req.user.id;
    await challenge.save();

    res.json({ success: true, message: "Challenge rejected", data: challenge });
  } catch (err) {
    console.error("rejectChallenge Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// ========================
