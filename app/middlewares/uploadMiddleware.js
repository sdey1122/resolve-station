/**
 * ==========================================
 * Upload Middleware
 * ==========================================
 */

const multer = require("multer");
const path = require("path");

/**
 * ==========================================
 * MEMORY STORAGE
 * ==========================================
 */

const storage = multer.memoryStorage();

/**
 * ==========================================
 * FILE FILTER
 * ==========================================
 */

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."), false);
};

/**
 * ==========================================
 * MULTER CONFIGURATION
 * ==========================================
 */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
