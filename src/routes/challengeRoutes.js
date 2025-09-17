const express = require("express");
const Challenge = require("../models/Challenge");
const verifyFirebaseToken = require("../middleware/authMiddleware"); 
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// -------------------------
// Create a challenge (any logged-in user)
// -------------------------
router.post("/", async (req, res) => {
  try {
    const challenge = await Challenge.create({
      ...req.body,
      
      status: "pending",
    });
    res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    console.error("createChallenge Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------
// Get all approved challenges (public)
// -------------------------
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search,
      category,
      urgency_level,
      reward_type,
    } = req.query;

    const query = { status: "approved" }; // Only approved challenges

    // Search by title, brief_description, detailed_description, organization
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { brief_description: { $regex: search, $options: "i" } },
        { detailed_description: { $regex: search, $options: "i" } },
        { "contact_info.organization": { $regex: search, $options: "i" } },
      ];
    }

    // Apply filters if provided
    if (category) query.category = category;
    if (urgency_level) query.urgency_level = urgency_level;
    if (reward_type) query.reward_type = reward_type;

    // Pagination
    const challenges = await Challenge.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Challenge.countDocuments(query);

    res.json({
      success: true,
      data: challenges,
      page: parseInt(page),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("getAllChallenges Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------
// Get single challenge by ID (public, approved only)
// -------------------------
router.get("/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || challenge.status !== "approved") {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }
    res.json({ success: true, data: challenge });
  } catch (err) {
    console.error("getChallengeById Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------
// Update challenge (creator or admin)
// -------------------------
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });

    if (challenge.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    Object.assign(challenge, req.body);
    const updatedChallenge = await challenge.save();
    res.json({ success: true, data: updatedChallenge });
  } catch (err) {
    console.error("updateChallenge Error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------
// Delete challenge (creator or admin)
// -------------------------
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });

    if (challenge.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await challenge.remove();
    res.json({ success: true, message: "Challenge deleted" });
  } catch (err) {
    console.error("deleteChallenge Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================
// ADMIN: Get all pending challenges
// ========================
router.get("/admin/pending", verifyFirebaseToken, isAdmin, async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: "pending" }).populate("createdBy", "name email");
    res.json({ success: true, data: challenges });
  } catch (err) {
    console.error("getPendingChallenges Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================
// ADMIN: Approve challenge
// ========================
router.put("/:id/approve", verifyFirebaseToken, isAdmin, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });

    challenge.status = "approved";
    challenge.approvedBy = req.user.id;
    await challenge.save();

    res.json({ success: true, message: "Challenge approved", data: challenge });
  } catch (err) {
    console.error("approveChallenge Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================
// ADMIN: Reject challenge
// ========================
router.put("/:id/reject", verifyFirebaseToken, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });

    challenge.status = "rejected";
    challenge.rejectionReason = reason || "No reason provided";
    challenge.approvedBy = req.user.id;
    await challenge.save();

    res.json({ success: true, message: "Challenge rejected", data: challenge });
  } catch (err) {
    console.error("rejectChallenge Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
