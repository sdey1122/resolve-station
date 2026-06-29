/**
 * ==========================================
 * ADMIN API ROUTES
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const adminController = require("../../controllers/adminController");

const authMiddleware = require("../../middlewares/authMiddleware");

const roleMiddleware = require("../../middlewares/roleMiddleware");

const upload = require("../../middlewares/uploadMiddleware");

/**
 * ==========================================
 * MIDDLEWARE
 * ==========================================
 */

const adminOnly = [authMiddleware, roleMiddleware("ADMIN")];

/**
 * ==========================================
 * DASHBOARD
 * ==========================================
 */

router.get("/dashboard", ...adminOnly, (req, res) => {
  return res.status(200).json({
    success: true,

    message: "Welcome to ResolveStation Admin Dashboard.",

    user: {
      id: req.user._id,

      name: req.user.name,

      email: req.user.email,

      role: req.user.role,
    },
  });
});

/**
 * ==========================================
 * ADMIN PROFILE
 * ==========================================
 */

router.get("/profile", ...adminOnly, adminController.getProfile);

router.put(
  "/profile",
  ...adminOnly,
  upload.single("profileImage"),
  adminController.updateProfile,
);

/**
 * ==========================================
 * STAFF MANAGEMENT
 * ==========================================
 */

/**
 * Create Staff
 */

router.post(
  "/staff",
  ...adminOnly,
  upload.single("profileImage"),
  adminController.createStaff,
);

/**
 * Read Staff
 */

router.get("/staff", ...adminOnly, adminController.getAllStaff);

router.get("/staff/deleted", ...adminOnly, adminController.getDeletedStaff);

router.get("/staff/:id", ...adminOnly, adminController.getStaffById);

/**
 * Update Staff
 */

router.put(
  "/staff/:id",
  ...adminOnly,
  upload.single("profileImage"),
  adminController.updateStaff,
);

/**
 * Restore Staff
 */

router.patch("/staff/:id/restore", ...adminOnly, adminController.restoreStaff);

/**
 * Delete Staff
 */

router.delete("/staff/:id", ...adminOnly, adminController.deleteStaff);

router.delete(
  "/staff/:id/permanent",
  ...adminOnly,
  adminController.permanentlyDeleteStaff,
);

/**
 * ==========================================
 * RESIDENT MANAGEMENT
 * ==========================================
 */

/**
 * Read Residents
 */

router.get("/resident", ...adminOnly, adminController.getAllResidents);

router.get(
  "/resident/deleted",
  ...adminOnly,
  adminController.getDeletedResidents,
);

router.get("/resident/:id", ...adminOnly, adminController.getResidentById);

/**
 * Update Resident
 */

router.put(
  "/resident/:id",
  ...adminOnly,
  upload.single("profileImage"),
  adminController.updateResident,
);

/**
 * Restore Resident
 */

router.patch(
  "/resident/:id/restore",
  ...adminOnly,
  adminController.restoreResident,
);

/**
 * Delete Resident
 */

router.delete("/resident/:id", ...adminOnly, adminController.deleteResident);

router.delete(
  "/resident/:id/permanent",
  ...adminOnly,
  adminController.permanentlyDeleteResident,
);

/**
 * ==========================================
 * COMPLAINT MANAGEMENT
 * ==========================================
 */

/**
 * Staff List
 */

router.get("/complaints/staff", ...adminOnly, adminController.getStaffList);

/**
 * Complaint Review
 */

router.patch(
  "/complaints/:id/approve",
  ...adminOnly,
  adminController.approveComplaint,
);

router.patch(
  "/complaints/:id/reject",
  ...adminOnly,
  adminController.rejectComplaint,
);

/**
 * ==========================================
 * COMPLETED WORK REVIEW
 * ==========================================
 */

router.patch(
  "/completed-reviews/:id/approve",
  ...adminOnly,
  adminController.approveCompletedComplaint,
);

router.patch(
  "/completed-reviews/:id/reject",
  ...adminOnly,
  adminController.rejectCompletedComplaint,
);

/**
 * ==========================================
 * CANNOT COMPLETE REVIEW
 * ==========================================
 */

router.patch(
  "/cannot-complete-reviews/:id/approve",
  ...adminOnly,
  adminController.approveCannotCompleteComplaint,
);

router.patch(
  "/cannot-complete-reviews/:id/reject",
  ...adminOnly,
  adminController.rejectCannotCompleteComplaint,
);

/**
 * ==========================================
 * AUDIT LOGS
 * ==========================================
 */

router.get("/audit-logs", ...adminOnly, adminController.getAuditLogs);

/**
 * ==========================================
 * EXPORT
 * ==========================================
 */

module.exports = router;
