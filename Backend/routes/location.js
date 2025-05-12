const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const { auth, isUser } = require("../middleware/auth");

// ADD a new location (protected: user) - pass profileId as a route param
router.post(
  "/:profileId",
  auth,
  isUser,
  locationController.addLocation
);

// READ a location by ID (protected: user)
router.get("/:profileId", auth, isUser, locationController.getLocation);


module.exports = router;
