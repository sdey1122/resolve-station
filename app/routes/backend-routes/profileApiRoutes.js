/**
 * ==========================================
 * Profile API Routes
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const profileController = require("../../controllers/profileController");

const authMiddleware = require("../../middlewares/authMiddleware");

const upload = require("../../middlewares/uploadMiddleware");

/**
 * ==========================================
 * GET MY PROFILE
 * ==========================================
 */

router.get("/me", authMiddleware, profileController.getMyProfile);

/**
 * ==========================================
 * UPDATE PROFILE IMAGE
 * ==========================================
 */

router.patch(
  "/image",
  authMiddleware,
  upload.single("profileImage"),
  profileController.updateProfileImage,
);

/**
 * ==========================================
 * DELETE PROFILE IMAGE
 * ==========================================
 */

router.delete("/image", authMiddleware, profileController.deleteProfileImage);

/**
 * ==========================================
 * CHANGE PASSWORD
 * ==========================================
 */

router.patch(
  "/change-password",
  authMiddleware,
  profileController.changePassword,
);

module.exports = router;
