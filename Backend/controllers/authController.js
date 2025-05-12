const User = require("../models/user/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }
 
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user without token first
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    // Now generate JWT token with user id
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Save token in user document
    user.token = token;
    await user.save();

    console.log("New user ID:", user._id);

    // Set cookie for token
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Save or update token in user document in database
      user.token = token;
      await user.save();

      user.password = undefined;
      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Login Server error" });
  }
};

// Google Signup/Login
exports.googleAuth = async (req, res) => {
  try {
    const { email, providerId, name } = req.body;
    if (!email || !providerId) {
      return res
        .status(400)
        .json({ success: false, message: "Email and providerId are required" });
    }
    let user = await User.findOne({ provider: "google", providerId });
    if (!user) {
      user = new User({
        email,
        provider: "google",
        providerId,
        // Optionally add name or other fields
      });
      await user.save();
    }
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    user.token = token;
    await user.save();
    res
      .status(200)
      .json({ success: true, token, user, message: "Google Auth Success" });
  } catch (err) {
    res.status(500).json({ message: "Google Auth Server error" });
  }
};

// Facebook Signup/Login
exports.facebookAuth = async (req, res) => {
  try {
    const { email, providerId, name } = req.body;
    if (!email || !providerId) {
      return res
        .status(400)
        .json({ success: false, message: "Email and providerId are required" });
    }
    let user = await User.findOne({ provider: "facebook", providerId });
    if (!user) {
      user = new User({
        email,
        provider: "facebook",
        providerId,
        // Optionally add name or other fields
      });
      await user.save();
    }
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    user.token = token;
    await user.save();
    res
      .status(200)
      .json({ success: true, token, user, message: "Facebook Auth Success" });
  } catch (err) {
    res.status(500).json({ message: "Facebook Auth Server error" });
  }
};

// Apple (iOS) Signup/Login
exports.appleAuth = async (req, res) => {
  try {
    const { email, providerId, name } = req.body;
    if (!email || !providerId) {
      return res
        .status(400)
        .json({ success: false, message: "Email and providerId are required" });
    }
    let user = await User.findOne({ provider: "apple", providerId });
    if (!user) {
      user = new User({
        email,
        provider: "apple",
        providerId,
        // Optionally add name or other fields
      });
      await user.save();
    }
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    user.token = token;
    await user.save();
    res
      .status(200)
      .json({ success: true, token, user, message: "Apple Auth Success" });
  } catch (err) {
    res.status(500).json({ message: "Apple Auth Server error" });
  }
};
