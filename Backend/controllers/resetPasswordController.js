const User = require("../models/user/User");
const bcrypt = require("bcryptjs");
const OTP = require("../models/OTP/OTP");
const otpGenerator = require("otp-generator");

// Step 1: Send OTP to email
exports.sendResetPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    const otpDoc = await OTP.create({
      email,
      otp,
      type: "reset-password",
    });

    // console.log("Generated OTP:", otp); // Debug log

    res.status(200).json({
      success: true,
      message: "Reset password OTP sent successfully",
      otp: otp, // Temporary: remove in production
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Step 2: Verify OTP
exports.verifyResetPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find the most recent OTP for this email and type
    const recentOtp = await OTP.findOne({
      email,
      type: "reset-password",
    }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email",
      });
    }

    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Step 3: Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, password: newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    // Validate password
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: "Please check the field names in your request",
    });
  }
};
