const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  description: String,
  website: String,
  logo: String, // Cloudinary image URL
  challenges_posted: { type: Number, default: 0 },
  firebaseUid: { type: String, required: true, unique: true } // link to Firebase Auth UID
}, { timestamps: true });

module.exports = mongoose.model("Organization", organizationSchema);
