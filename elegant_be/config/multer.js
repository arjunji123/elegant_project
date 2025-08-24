const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "category_icons",  // Cloudinary folder ka naam
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `category_${Date.now()}`, // filename jaisa tum chahte ho
  },
});

// Multer instance
const upload = multer({ storage });

module.exports = upload;
