const mongoose = require("mongoose");
const mailSender = require("../../config/mail/mailSender");
const emailTemplate = require("../../config/mail/templates/emailVerificationTemplate");
const resetPasswordTemplate = require("../../config/mail/templates/resetPasswordTemplate");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["signup", "reset-password"],
    default: "signup",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // Document expires after 5 minutes
  },
});

// Send verification email after saving OTP
OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    const template =
      this.type === "reset-password"
        ? resetPasswordTemplate(this.otp)
        : emailTemplate(this.otp);

    const subject =
      this.type === "reset-password"
        ? "DreamyDate Password Reset"
        : "DreamyDate Email Verification";

    await mailSender(this.email, subject, template);
  }
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
