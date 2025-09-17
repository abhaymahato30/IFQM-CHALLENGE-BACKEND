// middleware/firebaseAuthOnly.js
const admin = require("../config/firebase");

const firebaseAuthOnly = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No or invalid Authorization header",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach UID + email (needed for creating user)
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
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

module.exports = firebaseAuthOnly;
