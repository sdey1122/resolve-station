/**
 * ==========================================
 * Staff API Routes
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/authMiddleware");

const roleMiddleware = require("../../middlewares/roleMiddleware");

/**
 * ==========================================
 * STAFF DASHBOARD
 * ==========================================
 */

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN", "STAFF"),
  (req, res) => {
    return res.status(200).json({
      success: true,

      message: "Welcome Staff Dashboard.",

      user: {
        id: req.user._id,

        name: req.user.name,

        email: req.user.email,

        role: req.user.role,
      },
    });
  },
);

module.exports = router;
