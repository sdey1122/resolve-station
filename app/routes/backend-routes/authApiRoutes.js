/**
 * ==========================================
 * Authentication API Routes
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const authController = require("../../controllers/authController");

const upload = require("../../middlewares/uploadMiddleware");

const authMiddleware = require("../../middlewares/authMiddleware");

/**
 * ==========================================
 * REGISTER
 * ==========================================
 */

router.post(
  "/register",
  upload.single("profileImage"),
  authController.register,
);

/**
 * ==========================================
 * VERIFY EMAIL
 * ==========================================
 */

router.get("/verify-email/:token", authController.verifyEmail);

/**
 * ==========================================
 * LOGIN
 * ==========================================
 */

router.post("/login", authController.login);

/**
 * ==========================================
 * LOGOUT
 * ==========================================
 */

router.post("/logout", authMiddleware, authController.logout);

/**
 * ==========================================
 * REFRESH TOKEN
 * ==========================================
 */

router.post("/refresh-token", authController.refreshToken);

/**
 * ==========================================
 * FORGOT PASSWORD
 * ==========================================
 */

router.post("/forgot-password", authController.forgotPassword);

/**
 * ==========================================
 * RESET PASSWORD
 * ==========================================
 */

router.post("/reset-password/:token", authController.resetPassword);

// temp

// router.get("/me", authMiddleware, (req, res) => {
//   res.json({
//     success: true,
//     user: req.user,
//   });
// });

module.exports = router;
