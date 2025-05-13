const Profile = require("../models/profile/Profile");
const User = require("../models/user/User");
const {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
} = require("./fileUpload");
const cloudinary = require("../config/cloudinary/cloudinary");

// Create a new profile and link it to a user by user id from req.user.id
exports.createProfile = async (req, res) => {
  try {
    const formData = req.body;
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
    } = formData;

    // Handle file upload
    let profilePictureUrl = "";
    if (req.files && (req.files.file || req.files.profilePicture)) {
      const file = req.files.file || req.files.profilePicture;
      try {
        profilePictureUrl = await uploadToCloudinary(file);
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Profile picture upload failed",
          error: uploadError.message,
        });
      }
    }

    // Handle photos array upload
    let photosUrls = [];
    if (req.files && req.files.photos) {
      try {
        const photoFiles = Array.isArray(req.files.photos)
          ? req.files.photos
          : [req.files.photos];
        photosUrls = await uploadMultipleToCloudinary(photoFiles);
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Photos upload failed",
          error: uploadError.message,
        });
      }
    }

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

    // Create profile with all fields - ensure numbers are properly converted
    const profile = new Profile({
      profilePicture: profilePictureUrl,
      photos: photosUrls,
      name,
      countryCode: Number(countryCode) || 0,
      phoneNumber: Number(phoneNumber) || 0,
      gender,
      relationshipStatus,
      sexualOrientation,
      interestedSexualOrientation,
      lookingFor,
      interest: Array.isArray(interest) ? interest : interest ? [interest] : [],
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
    console.error("Create profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Error creating profile",
      error: err.message,
    });
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

// Helper function to delete image from Cloudinary
exports.updateProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findById(req.params.profileId);
    if (!existingProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    let updateData = { ...req.body };

    // Handle profile picture update first
    let profilePictureUrl = existingProfile.profilePicture;
    if (req.files && (req.files.file || req.files.profilePicture)) {
      const file = req.files.file || req.files.profilePicture;
      try {
        // Delete old image
        if (existingProfile.profilePicture) {
          await deleteFromCloudinary(existingProfile.profilePicture);
        }
        // Upload and get new URL
        profilePictureUrl = await uploadToCloudinary(file);
      } catch (error) {
        console.error("Image update error:", error);
        return res.status(400).json({
          success: false,
          message: "Failed to update profile picture",
          error: error.message,
        });
      }
    }

    // Handle photos array update
    if (req.files && req.files.photos) {
      try {
        // Delete existing photos if any
        if (existingProfile.photos && existingProfile.photos.length > 0) {
          await Promise.all(
            existingProfile.photos.map((photoUrl) =>
              deleteFromCloudinary(photoUrl)
            )
          );
        }

        // Upload new photos
        const photoFiles = Array.isArray(req.files.photos)
          ? req.files.photos
          : [req.files.photos];
        const newPhotosUrls = await uploadMultipleToCloudinary(photoFiles);
        updateData.photos = newPhotosUrls;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Failed to update photos",
          error: error.message,
        });
      }
    }

    // Combine all updates
    const updates = {
      ...req.body,
      profilePicture: profilePictureUrl, // Always set profilePicture
    };

    // Update profile with new data
    const profile = await Profile.findByIdAndUpdate(
      req.params.profileId,
      updateData,
      { new: true }
    ).exec();

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    console.error("Update error:", err);
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
