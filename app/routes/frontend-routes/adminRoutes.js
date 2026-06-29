/**
 * ==========================================
 * ADMIN FRONTEND ROUTES
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const adminFrontendController = require("../../controllers/adminFrontendController");

const frontendAuthMiddleware = require("../../middlewares/frontendAuthMiddleware");

const roleMiddleware = require("../../middlewares/roleMiddleware");

/**
 * ==========================================
 * PROTECTED ADMIN ROUTES
 * ==========================================
 */

router.use(frontendAuthMiddleware);

router.use(roleMiddleware("ADMIN"));

/**
 * ==========================================
 * DASHBOARD
 * ==========================================
 */

router.get("/dashboard", adminFrontendController.dashboard);

/**
 * ==========================================
 * COMPLAINT MANAGEMENT
 * ==========================================
 */

// Pending Complaints

router.get("/complaints/pending", adminFrontendController.pendingComplaints);

/**
 * ==========================================
 * REVIEW COMPLAINT
 * ==========================================
 */

// All Complaints

router.get("/complaints", adminFrontendController.allComplaints);

// Complaint Details

router.get("/complaints/:id", adminFrontendController.complaintDetails);

/**
 * ==========================================
 * STAFF MANAGEMENT
 * ==========================================
 */

// Create Staff

router.get("/staff/create", adminFrontendController.manageStaff);

// Edit Staff

router.get("/staff/manage/:id", adminFrontendController.manageStaff);

// View Staff

router.get("/staff/show", adminFrontendController.showStaff);

/**
 * ==========================================
 * RESIDENT MANAGEMENT
 * ==========================================
 */

// Edit Resident

router.get("/resident/manage/:id", adminFrontendController.manageResident);

// View Residents

router.get("/resident/show", adminFrontendController.showResident);

/**
 * ==========================================
 * STAFF REVIEW
 * ==========================================
 */

// Completed jobs waiting for approval

router.get("/completed-reviews", adminFrontendController.completedReviews);

// Staff reported unable to complete

router.get(
  "/cannot-complete-reviews",
  adminFrontendController.cannotCompleteReviews,
);

/**
 * ==========================================
 * ACCOUNT TRASH
 * ==========================================
 */

router.get("/account-trash", adminFrontendController.accountTrash);

/**
 * ==========================================
 * ADMIN PROFILE
 * ==========================================
 */

router.get("/profile", adminFrontendController.profile);

/**
 * ==========================================
 * AUDIT LOGS
 * ==========================================
 */

router.get("/audit-logs", adminFrontendController.auditLogs);

module.exports = router;
