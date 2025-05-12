const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  address: {
    type: String,
  },
});

module.exports = mongoose.model("Location", locationSchema);
