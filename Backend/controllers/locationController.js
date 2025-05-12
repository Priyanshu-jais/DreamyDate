const Location = require("../models/profile/Location");
const Profile = require("../models/profile/Profile");

// Create a new location and set its reference in Profile, then return populated profile
exports.addLocation = async (req, res) => {
  try {
    // Get profileId from route params
    const profileId = req.params.profileId;
    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "profileId is required in route params",
      });
    }

    // Find the profile
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // If profile already has a location, delete the old location from DB
    if (profile.location) {
      await Location.findByIdAndDelete(profile.location);
    }

    // Create and save new location
    const location = new Location(req.body);
    await location.save();

    // Set new location reference in Profile
    profile.location = location._id;
    await profile.save();

    // Fetch the updated profile with populated location
    const updatedProfile = await Profile.findById(profile._id).populate(
      "location"
    );

    res.status(201).json({
      success: true,
      message: "Location Added successfully.",
      location,
      profile: updatedProfile,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error while adding location: " + err.message,
    });
  }
};

// Get the location for a profile by profileId
exports.getLocation = async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const profile = await Profile.findById(profileId).populate("location");
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json({
      success: true,
      message: "Location fetched successfully.",
      location: profile.location,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
