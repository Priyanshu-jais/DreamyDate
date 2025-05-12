const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const authController = require("../controllers/authController");

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

router.post("/google", authController.googleAuth);
router.post("/facebook", authController.facebookAuth);
router.post("/apple", authController.appleAuth);

module.exports = router;
