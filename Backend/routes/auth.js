const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  googleAuth,
  sendotp,
} = require("../controllers/authController");
const {
  sendResetPasswordOTP,
  verifyResetPasswordOTP,
  resetPassword,
} = require("../controllers/resetPasswordController");

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

router.post("/google", googleAuth);
router.post("/sendotp", sendotp);
// router.post("/facebook", authController.facebookAuth);
// router.post("/apple", authController.appleAuth);

// Password Reset Flow - 3 steps
router.post("/forgot-password", sendResetPasswordOTP);
router.post("/verify-otp", verifyResetPasswordOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
