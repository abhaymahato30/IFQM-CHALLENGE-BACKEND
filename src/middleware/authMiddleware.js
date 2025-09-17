// middleware/verifyFirebaseToken.js
const admin = require("../config/firebase");
const User = require("../models/User");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No or invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Find user in MongoDB
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    // Attach ALL frontend fields to req.user
    req.user = {
      id: user._id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified || false,
      active_challenges: user.active_challenges || 0,
      solutions_submitted: user.solutions_submitted || 0,
      rewards_earned: user.rewards_earned || 0,
      avg_rating: user.avg_rating || 0,
      skills: Array.isArray(user.skills) ? user.skills : [],
      achievements: Array.isArray(user.achievements) ? user.achievements : [],
    };

    next();
  } catch (error) {
    console.error("❌ Firebase Auth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = verifyFirebaseToken;
