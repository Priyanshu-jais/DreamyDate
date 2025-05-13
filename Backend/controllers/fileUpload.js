const cloudinary = require("../config/cloudinary/cloudinary");

const FOLDERS = {
  PROFILE_PICS: "DreamyDateApp/ProfilePics",
  BEST_PHOTOS: "DreamyDateApp/BestPhotos",
};

// Profile Picture Upload
exports.uploadToCloudinary = async (file, folder = FOLDERS.PROFILE_PICS) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: "auto",
    });
    console.log(`Uploaded to ${folder}:`, result.public_id);
    return result.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

// Multiple Photos Upload
exports.uploadMultipleToCloudinary = async (files) => {
  try {
    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.tempFilePath, {
        folder: FOLDERS.BEST_PHOTOS,
        resource_type: "auto",
      })
    );

    const results = await Promise.all(uploadPromises);
    console.log(`Uploaded ${results.length} photos to ${FOLDERS.BEST_PHOTOS}`);
    return results.map((result) => result.secure_url);
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw error;
  }
};

exports.deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Determine which folder the image is from
    const folder = imageUrl.includes("ProfilePics")
      ? FOLDERS.PROFILE_PICS
      : FOLDERS.BEST_PHOTOS;
    const urlParts = imageUrl.split(folder + "/");

    if (urlParts.length < 2) {
      console.log("Invalid URL format or wrong folder");
      return;
    }

    const filename = urlParts[1].split(".")[0];
    const public_id = `${folder}/${filename}`;

    console.log("Attempting to delete:", public_id);
    const result = await cloudinary.uploader.destroy(public_id);
    console.log("Delete result:", result);
    return result;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

// Image upload handler
exports.imageUpload = async (req, res) => {
  try {
    // Handle multiple photos upload
    if (req.files && req.files.photos) {
      const files = Array.isArray(req.files.photos)
        ? req.files.photos
        : [req.files.photos];
      const urls = await exports.uploadMultipleToCloudinary(files);
      return res.json({
        success: true,
        imageUrls: urls,
        message: "Multiple photos uploaded successfully",
      });
    }

    // Handle single profile picture upload
    const file = req.files && (req.files.file || req.files.profilePicture);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Supported types
    const supportedTypes = ["jpg", "jpeg", "png", "webp"];
    const fileType = file.name.split(".").pop().toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    const imageUrl = await exports.uploadToCloudinary(
      file,
      FOLDERS.PROFILE_PICS
    );
    res.json({
      success: true,
      imageUrl,
      message: "Profile picture uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(400).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}
