/**
 * ==========================================
 * Admin API Routes
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/authMiddleware");

const roleMiddleware = require("../../middlewares/roleMiddleware");

const adminController = require("../../controllers/adminController");

const upload = require("../../middlewares/uploadMiddleware");
/**
 * ==========================================
 * ADMIN DASHBOARD
 * ==========================================
 */

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {
    return res.status(200).json({
      success: true,

      message: "Welcome Admin Dashboard.",

      user: {
        id: req.user._id,

        name: req.user.name,

        email: req.user.email,

        role: req.user.role,
      },
    });
  },
);

/**
 * ==========================================
 * CREATE STAFF
 * ==========================================
 */

router.post(
  "/staff",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("profileImage"),
  adminController.createStaff,
);

/**
 * ==========================================
 * GET ALL STAFF
 * ==========================================
 */

router.get(
  "/staff",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAllStaff,
);

/**
 * ==========================================
 * GET DELETED STAFF
 * ==========================================
 */

router.get(
  "/staff/deleted",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getDeletedStaff,
);

/**
 * ==========================================
 * SOFT DELETE STAFF
 * ==========================================
 */

router.delete(
  "/staff/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.deleteStaff,
);

/**
 * ==========================================
 * RESTORE STAFF
 * ==========================================
 */

router.patch(
  "/staff/:id/restore",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.restoreStaff,
);

/**
 * ==========================================
 * PERMANENT DELETE STAFF
 * ==========================================
 */

router.delete(
  "/staff/:id/permanent",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.permanentlyDeleteStaff,
);

/**
 * ==========================================
 * GET AUDIT LOGS
 * ==========================================
 */

router.get(
  "/audit-logs",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getAuditLogs,
);

module.exports = router;
