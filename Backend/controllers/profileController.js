const Profile = require("../models/profile/Profile");
const User = require("../models/user/User");

// Create a new profile and link it to a user by user id from req.user.id
exports.createProfile = async (req, res) => {
  try {
    const {
      name,
      countryCode,
      phoneNumber,
      gender,
      relationshipStatus,
      sexualOrientation,
      interestedSexualOrientation,
      lookingFor,
      interest,
    } = req.body;

    // Get user by id from req.user (set by auth middleware)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for the provided id.",
      });
    }

    // Check if profile already exists for this user
    if (user.profileDetails) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user.",
      });
    }

    // Create profile
    const profile = new Profile({
      name,
      countryCode,
      phoneNumber,
      gender,
      relationshipStatus,
      sexualOrientation,
      interestedSexualOrientation,
      lookingFor,
      interest: Array.isArray(interest) ? interest : [],
      // photos field removed for now
    });

    await profile.save();

    // Link the profile to the user document using the reference field
    user.profileDetails = profile._id;
    await user.save();

    // Populate profileDetails when returning user
    const populatedUser = await User.findById(user.id)
      .populate("profileDetails")
      .exec();

    return res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      profile,
      user: populatedUser,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get a profile by ID
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.profileId);
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    res.status(200).json({ success: true, profile });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update a profile by ID
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.profileId,
      req.body,
      {
        new: true,
      }
    );
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    res.status(200).json({ success: true, profile });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a user by profileId: delete location, then profile, then user
exports.deleteProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId;

    // Find the profile
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    // Delete associated location if exists
    if (profile.location) {
      await require("../models/profile/Location").findByIdAndDelete(
        profile.location
      );
    }

    // Delete the profile
    await Profile.findByIdAndDelete(profileId);

    // Find and update the user to remove profileDetails reference
    const user = await User.findOne({ profileDetails: profileId });
    if (user) {
      user.profileDetails = undefined;
      await user.save();
      // Delete the user
      await User.findByIdAndDelete(user._id);
    }

    res
      .status(200)
      .json({ success: true, message: "User, profile, and location deleted" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all user details (dummy implementation)
exports.getAllUserDetails = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.status(200).json({ success: true, profiles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
