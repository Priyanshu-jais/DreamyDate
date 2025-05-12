const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    token: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook", "apple"],
      default: "local",
    },
    providerId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
