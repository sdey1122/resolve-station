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
