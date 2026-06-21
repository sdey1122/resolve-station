/**
 * ==========================================
 * Resident API Routes
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/authMiddleware");

/**
 * ==========================================
 * RESIDENT DASHBOARD
 * ==========================================
 */

router.get("/dashboard", authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,

    message: "Welcome Resident Dashboard.",

    user: {
      id: req.user._id,

      name: req.user.name,

      email: req.user.email,

      role: req.user.role,
    },
  });
});

module.exports = router;
