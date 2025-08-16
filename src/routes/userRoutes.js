// routes/userRoutes.js
const express = require("express");
const verifyFirebaseToken = require("../middleware/authMiddleware"); // your Firebase auth middleware
const userController = require("../controllers/userController");

const router = express.Router();

// -------------------------
// Debug middleware to log requests
// -------------------------
router.use((req, res, next) => {
  console.log(`📡 [${req.method}] ${req.originalUrl}`);
  next();
});

// -------------------------
// All protected user routes
// -------------------------
router.get("/profile", verifyFirebaseToken, userController.getProfile);
router.get("/my-challenges", verifyFirebaseToken, userController.getMyChallenges);
router.get("/my-solutions", verifyFirebaseToken, userController.getMySolutions);
router.get("/bookmarks", verifyFirebaseToken, userController.getBookmarks);

// -------------------------
// Public user routes
// -------------------------

/**
 * @desc   Get all users
 * @route  GET /api/users
 * @access Public
 */
router.get("/", async (req, res) => {
  try {
    const users = await require("../models/User").find();
    res.json({ success: true, data: users });
  } catch (err) {
    console.error("❌ Get all users error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @desc   Get user by ID
 * @route  GET /api/users/:id
 * @access Public
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    console.error("❌ Get user by ID error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @desc   Update user by ID (owner only)
 * @route  PUT /api/users/:id
 * @access Private
 */
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.firebaseUid !== req.user.uid) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    Object.assign(user, req.body);
    const updatedUser = await user.save();

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error("❌ Update user error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @desc   Delete user by ID (owner only)
 * @route  DELETE /api/users/:id
 * @access Private
 */
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.firebaseUid !== req.user.uid) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await user.remove();
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
