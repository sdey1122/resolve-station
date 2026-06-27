// /**
//  * ==========================================
//  * ADMIN API ROUTES
//  * ==========================================
//  */

// const express = require("express");

// const router = express.Router();

// const adminController = require("../../controllers/adminController");

// const authMiddleware = require("../../middlewares/authMiddleware");

// const roleMiddleware = require("../../middlewares/roleMiddleware");

// const upload = require("../../middlewares/uploadMiddleware");

// /**
//  * ==========================================
//  * MIDDLEWARE
//  * ==========================================
//  */

// const adminOnly = [authMiddleware, roleMiddleware("ADMIN")];

// /**
//  * ==========================================
//  * ADMIN DASHBOARD
//  * ==========================================
//  */

// router.get("/dashboard", ...adminOnly, (req, res) => {
//   return res.status(200).json({
//     success: true,

//     message: "Welcome Admin Dashboard.",

//     user: {
//       id: req.user._id,

//       name: req.user.name,

//       email: req.user.email,

//       role: req.user.role,
//     },
//   });
// });

// /**
//  * ==========================================
//  * ADMIN PROFILE
//  * ==========================================
//  */

// /**
//  * Get Profile
//  */

// router.get("/profile", ...adminOnly, adminController.getProfile);

// /**
//  * Update Profile
//  */

// router.put(
//   "/profile",
//   ...adminOnly,
//   upload.single("profileImage"),
//   adminController.updateProfile,
// );

// /**
//  * ==========================================
//  * STAFF ROUTES
//  * ==========================================
//  */

// /**
//  * Create Staff
//  */

// router.post(
//   "/staff",
//   ...adminOnly,
//   upload.single("profileImage"),
//   adminController.createStaff,
// );

// /**
//  * Get All Staff
//  */

// router.get("/staff", ...adminOnly, adminController.getAllStaff);

// /**
//  * Get Deleted Staff
//  */

// router.get("/staff/deleted", ...adminOnly, adminController.getDeletedStaff);

// /**
//  * Soft Delete Staff
//  */

// router.delete("/staff/:id", ...adminOnly, adminController.deleteStaff);

// /**
//  * Restore Staff
//  */

// router.patch("/staff/:id/restore", ...adminOnly, adminController.restoreStaff);

// /**
//  * Permanent Delete Staff
//  */

// router.delete(
//   "/staff/:id/permanent",
//   ...adminOnly,
//   adminController.permanentlyDeleteStaff,
// );

// /**
//  * Get Staff By ID
//  */

// router.get("/staff/:id", ...adminOnly, adminController.getStaffById);

// /**
//  * Update Staff
//  */

// router.put(
//   "/staff/:id",
//   ...adminOnly,
//   upload.single("profileImage"),
//   adminController.updateStaff,
// );

// /**
//  * ==========================================
//  * RESIDENT ROUTES
//  * ==========================================
//  */

// /**
//  * Get All Residents
//  */

// router.get("/resident", ...adminOnly, adminController.getAllResidents);

// /**
//  * Soft Delete Resident
//  */

// router.delete("/resident/:id", ...adminOnly, adminController.deleteResident);

// /**
//  * Restore Resident
//  */

// router.patch(
//   "/resident/:id/restore",
//   ...adminOnly,
//   adminController.restoreResident,
// );

// /**
//  * Permanent Delete Resident
//  */

// router.delete(
//   "/resident/:id/permanent",
//   ...adminOnly,
//   adminController.permanentlyDeleteResident,
// );

// /**
//  * Get Deleted Residents
//  */

// router.get(
//   "/resident/deleted",
//   ...adminOnly,
//   adminController.getDeletedResidents,
// );

// /**
//  * Get Resident By ID
//  */

// router.get("/resident/:id", ...adminOnly, adminController.getResidentById);

// /**
//  * Update Resident
//  */

// router.put(
//   "/resident/:id",
//   ...adminOnly,
//   upload.single("profileImage"),
//   adminController.updateResident,
// );

// /**
//  * ==========================================
//  * ADMIN PROFILE
//  * ==========================================
//  */

// /**
//  * Get Admin Profile
//  */

// router.get("/profile", ...adminOnly, adminController.getProfile);

// /**
//  * Update Admin Profile
//  */

// router.put(
//   "/profile",
//   ...adminOnly,
//   upload.single("profileImage"),
//   adminController.updateProfile,
// );

// /**
//  * ==========================================
//  * AUDIT LOGS
//  * ==========================================
//  */

// router.get("/audit-logs", ...adminOnly, adminController.getAuditLogs);

// /**
//  * ==========================================
//  * EXPORT ROUTER
//  * ==========================================
//  */

// module.exports = router;

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
 * ADMIN PROFILE
 * ==========================================
 */

/**
 * Get Admin Profile
 */

router.get("/profile", ...adminOnly, adminController.getProfile);

/**
 * Update Admin Profile
 */

router.put(
  "/profile",
  ...adminOnly,
  upload.single("profileImage"),
  adminController.updateProfile,
);

/**
 * ==========================================
 * STAFF ROUTES
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
 * Delete / Restore Staff
 */

router.delete("/staff/:id", ...adminOnly, adminController.deleteStaff);

router.patch("/staff/:id/restore", ...adminOnly, adminController.restoreStaff);

router.delete(
  "/staff/:id/permanent",
  ...adminOnly,
  adminController.permanentlyDeleteStaff,
);

/**
 * ==========================================
 * RESIDENT ROUTES
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
 * Delete / Restore Resident
 */

router.delete("/resident/:id", ...adminOnly, adminController.deleteResident);

router.patch(
  "/resident/:id/restore",
  ...adminOnly,
  adminController.restoreResident,
);

router.delete(
  "/resident/:id/permanent",
  ...adminOnly,
  adminController.permanentlyDeleteResident,
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
