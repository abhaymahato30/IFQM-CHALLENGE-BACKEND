const Challenge = require("../models/Challenge");
const Solution = require("../models/Solution");
const User = require("../models/User");

// -------------------------
// Get logged-in user profile
// -------------------------
exports.getProfile = async (req, res) => {
  try {
    const { uid, email, name, email_verified, picture } = req.user; 
    // req.user is set by verifyFirebaseToken middleware

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // 🆕 Create new user if not exists
      user = await User.create({
        firebaseUid: uid,
        email,
        name,
        avatar: picture || null,
        is_verified: email_verified,
      });
      console.log("🆕 New user created:", user);
    } else {
      console.log("✅ Existing user found:", user);
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error("❌ getProfile error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Get challenges posted by user
// -------------------------
exports.getMyChallenges = async (req, res) => {
  try {
    console.log("🔥 getMyChallenges called", req.user);
    const firebaseUid = req.user?.uid;
    const challenges = await Challenge.find({ createdBy: firebaseUid }).lean();
    console.log("challenges found:", challenges.length);
    res.json(challenges);
  } catch (err) {
    console.error("getMyChallenges Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// -------------------------
// Get solutions submitted by user
// -------------------------
exports.getMySolutions = async (req, res) => {
  try {
    console.log("🔥 getMySolutions called", req.user);
    const firebaseUid = req.user?.uid;
    const solutions = await Solution.find({ createdBy: firebaseUid }).lean();
    console.log("solutions found:", solutions.length);
    res.json(solutions);
  } catch (err) {
    console.error("getMySolutions Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// -------------------------
// Get bookmarked challenges
// -------------------------
exports.getBookmarks = async (req, res) => {
  try {
    console.log("🔥 getBookmarks called", req.user);
    const firebaseUid = req.user?.uid;
    const user = await User.findOne({ firebaseUid }).populate("bookmarks").lean();
    console.log("bookmarks found:", user?.bookmarks?.length || 0);
    res.json(user?.bookmarks || []);
  } catch (err) {
    console.error("getBookmarks Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
