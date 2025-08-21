const multer = require("multer");
const path = require("path");
const uploadFolder = path.join(__dirname, "../uploads/category_icons");

// Storage config for category icons
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); // category_icons folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `category_${Date.now()}${ext}`); // category_ prefix
  }
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
  }
};

module.exports = multer({ storage, fileFilter });
