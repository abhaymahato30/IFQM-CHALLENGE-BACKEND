const Challenge = require("../models/Challenge");
const Solution = require("../models/Solution");
const User = require("../models/User");

// -------------------------
// Get logged-in user profile
// -------------------------
exports.getProfile = async (req, res) => {
  try {
    // req.user is already populated by middleware
    return res.status(200).json({ success: true, data: req.user });
  } catch (err) {
    console.error("❌ getProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// -------------------------
// Get challenges posted by user
// -------------------------
exports.getMyChallenges = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { status: "approved" };
    const challenges = await Challenge.find({ createdBy: req.user.id, ...filter }).lean();
    return res.json({ success: true, data: challenges });
  } catch (err) {
    console.error("getMyChallenges Error:", err);
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// -------------------------
// Get solutions submitted by user
// -------------------------
exports.getMySolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ user_id: req.user.id })
      .populate("challenge_id", "title status")
      .lean();

    // Admins see all, normal users only approved challenges
    const filtered = solutions.filter(
      s => req.user.role === "admin" || s.challenge_id.status === "approved"
    );

    return res.json({ success: true, data: filtered });
  } catch (err) {
    console.error("getMySolutions Error:", err);
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// -------------------------
// Get bookmarked challenges
// -------------------------
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("bookmarks").lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Only approved challenges
    const bookmarks = (user.bookmarks || []).filter(b => b.status === "approved");
    return res.json({ success: true, data: bookmarks });
  } catch (err) {
    console.error("getBookmarks Error:", err);
    return res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
