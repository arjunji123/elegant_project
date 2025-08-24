const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // jo tumne config banaya hai

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => `product_${Date.now()}`, // unique naam
  },
});

const upload = multer({ storage });

module.exports = upload;
