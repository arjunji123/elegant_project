const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // jo tumne config banaya hai

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pics", 
    allowed_formats: ["jpg", "jpeg", "png", "webp", "heic", "heif"],
    public_id: (req, file) => `profile_pic_${Date.now()}`, 
  },
});

const upload = multer({ storage });

module.exports = upload;

