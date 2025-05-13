const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    trim: true,
  },
  countryCode: {
    type: Number,
  },
  phoneNumber: {
    type: Number,
    trim: true,
  },
  gender: {
    type: String,
  },
  relationshipStatus: {
    type: String,
    enum: [
      "Single",
      "In a Relationship",
      "Married",
      "Divorced",
      "It's Complicated",
    ],
  },
  sexualOrientation: {
    type: String,
    enum: [
      "Straight",
      "Gay",
      "Lesbian",
      "Bisexual",
      "Asexual",
      "Demisexual",
      "Pansexual",
      "Queer",
      "Questioning",
    ],
  },
  interestedSexualOrientation: {
    type: String,
    enum: [
      "Straight",
      "Gay",
      "Lesbian",
      "Bisexual",
      "Asexual",
      "Demisexual",
      "Pansexual",
      "Queer",
      "Questioning",
    ],
  },
  lookingFor: {
    type: String,
    enum: ["Love", "Feelings", "Friends", "Aquaintance"],
  },
  interest: {
    type: [String],
    default: [],
  },
  photos: {
    type: [String], // Array of image URLs or paths
    default: [],
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: false,
  },
});

// Export the Profile model
module.exports = mongoose.model("Profile", profileSchema);
