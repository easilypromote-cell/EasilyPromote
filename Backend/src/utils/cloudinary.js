const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (file, folder = "easily-promote") => {
  return new Promise((resolve, reject) => {
    const isVideo = file.mimetype.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        allowed_formats: isVideo
          ? ["mp4", "mov", "avi", "webm"]
          : ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: isVideo
          ? [{ quality: "auto", fetch_format: "auto" }]
          : [{ quality: "auto", width: 1920, crop: "limit" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
