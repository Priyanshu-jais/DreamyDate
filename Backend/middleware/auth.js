const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user/User");
dotenv.config();

// Authentication middleware
exports.auth = async (req, res, next) => {
  try {
    let token =
      req.cookies.token ||
      req.body.token ||
      (req.header("Authorization") &&
        req.header("Authorization").replace("Bearer ", ""));

    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      // console.log("Decoded token:", req.user); // Debugging line
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong While Validating the Token",
    });
  }
};

// Middleware to check if user is a normal user
exports.isUser = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);
    // Fix: Allow user if userDetails exists and (role is "user" OR role is missing OR role is undefined/null)
    if (!userDetails || (userDetails.role && userDetails.role !== "user")) {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Users",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User Role Can't be Verified" });
  }
};

// Middleware to check if user is an admin
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);
    if (!userDetails || userDetails.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User Role Can't be Verified" });
  }
};
