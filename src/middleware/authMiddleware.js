// middleware/verifyFirebaseToken.js
const admin = require("../config/firebase");

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

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user info to request for next middleware/controller
    req.user = decodedToken;

    return next();
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = verifyFirebaseToken;
  