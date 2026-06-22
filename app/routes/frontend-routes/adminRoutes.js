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
 * STAFF
 * ==========================================
 */

router.get("/staff", adminFrontendController.staff);

router.get("/staff/create", adminFrontendController.createStaff);

router.get("/staff/:id", adminFrontendController.viewStaff);

router.get("/staff/:id/edit", adminFrontendController.editStaff);

/**
 * ==========================================
 * RESIDENTS
 * ==========================================
 */

router.get("/residents", adminFrontendController.residents);

router.get("/residents/:id", adminFrontendController.viewResident);

/**
 * ==========================================
 * MAINTENANCE
 * ==========================================
 */

router.get("/maintenance", adminFrontendController.maintenance);

router.get("/maintenance/:id", adminFrontendController.maintenanceView);

/**
 * ==========================================
 * TRASH
 * ==========================================
 */

router.get("/trash", adminFrontendController.trash);

/**
 * ==========================================
 * AUDIT LOGS
 * ==========================================
 */

router.get("/audit-logs", adminFrontendController.auditLogs);

module.exports = router;
