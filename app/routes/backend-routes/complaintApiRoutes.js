/**
 * ==========================================
 * COMPLAINT API ROUTES
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const complaintController = require("../../controllers/complaintController");

const authMiddleware = require("../../middlewares/authMiddleware");

const roleMiddleware = require("../../middlewares/roleMiddleware");

const upload = require("../../middlewares/uploadMiddleware");

/**
 * ==========================================
 * ROLE MIDDLEWARE
 * ==========================================
 */

const adminOnly = [authMiddleware, roleMiddleware("ADMIN")];

const staffOnly = [authMiddleware, roleMiddleware("STAFF")];

const residentOnly = [authMiddleware, roleMiddleware("RESIDENT")];

/**
 * ==========================================
 * RESIDENT ROUTES
 * ==========================================
 */

/**
 * Create Complaint
 */

router.post(
  "/",
  ...residentOnly,
  upload.single("image"),
  complaintController.createComplaint,
);

/**
 * Get My Complaints
 */

router.get("/my", ...residentOnly, complaintController.getResidentComplaints);

/**
 * Get Deleted Complaints
 */

router.get(
  "/deleted",
  ...residentOnly,
  complaintController.getDeletedComplaints,
);

/**
 * Get Complaint By ID
 */

router.get("/:id", ...residentOnly, complaintController.getComplaintById);

/**
 * Update Complaint
 */

router.put(
  "/:id",
  ...residentOnly,
  upload.single("image"),
  complaintController.updateComplaint,
);

/**
 * Soft Delete Complaint
 */

router.delete("/:id", ...residentOnly, complaintController.deleteComplaint);

/**
 * Restore Complaint
 */

router.patch(
  "/:id/restore",
  ...residentOnly,
  complaintController.restoreComplaint,
);

/**
 * Permanent Delete Complaint
 */

router.delete(
  "/:id/permanent",
  ...residentOnly,
  complaintController.permanentlyDeleteComplaint,
);

/**
 * ==========================================
 * ADMIN ROUTES
 * ==========================================
 */

/**
 * Get All Complaints
 */

router.get("/admin/all", ...adminOnly, complaintController.getAllComplaints);

/**
 * Get Complaint Details
 */

router.get("/admin/:id", ...adminOnly, complaintController.getComplaintDetails);

/**
 * Approve Complaint
 */

router.patch(
  "/admin/:id/approve",
  ...adminOnly,
  complaintController.approveComplaint,
);

/**
 * Reject Complaint
 */

router.patch(
  "/admin/:id/reject",
  ...adminOnly,
  complaintController.rejectComplaint,
);

/**
 * Assign Staff
 */

router.patch(
  "/admin/:id/assign",
  ...adminOnly,
  complaintController.assignStaff,
);

/**
 * Reassign Complaint
 */

router.patch(
  "/admin/:id/reassign",
  ...adminOnly,
  complaintController.reassignComplaint,
);

/**
 * Close Complaint
 */

router.patch(
  "/admin/:id/close",
  ...adminOnly,
  complaintController.closeComplaint,
);

/**
 * ==========================================
 * STAFF ROUTES
 * ==========================================
 */

/**
 * Start Work
 */

router.patch("/staff/:id/start", ...staffOnly, complaintController.startWork);

/**
 * Complete Work
 */

router.patch(
  "/staff/:id/complete",
  ...staffOnly,
  complaintController.completeWork,
);

/**
 * Cannot Complete Work
 */

router.patch(
  "/staff/:id/cannot-complete",
  ...staffOnly,
  complaintController.cannotCompleteWork,
);

/**
 * ==========================================
 * EXPORT ROUTER
 * ==========================================
 */

module.exports = router;
