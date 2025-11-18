const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage config for product images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "heic", "heif"],
    public_id: (req, file) => `product_${Date.now()}_${Math.round(Math.random() * 1E9)}`,
  },
});

const upload = multer({ storage });

module.exports = upload;