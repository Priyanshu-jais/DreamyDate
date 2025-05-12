const express = require("express");
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUserDetails,
} = require("../controllers/profileController");
const { auth, isUser, isAdmin } = require("../middleware/auth");

// Create profile (user only)
router.post("/", auth, isUser, createProfile);

// Get all user details (admin only)
router.get("/getUserDetails", auth, isAdmin, getAllUserDetails);

// Update profile (user only)
router.put("/updateProfile", auth, isUser, updateProfile);

// Delete profile/account (user only)
router.delete("/deleteProfile", auth, isUser, deleteProfile);

// Optionally, keep get by id if needed (user or admin)
router.get("/:id", auth, getProfile);

module.exports = router;
