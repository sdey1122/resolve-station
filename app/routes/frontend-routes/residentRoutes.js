const express = require("express");

const router = express.Router();

const frontendAuthMiddleware = require("../../middlewares/frontendAuthMiddleware");

const roleMiddleware = require("../../middlewares/roleMiddleware");

const residentFrontendController = require("../../controllers/residentFrontendController");

/**
 * ==========================================
 * PROTECTED RESIDENT ROUTES
 * ==========================================
 */

router.use(frontendAuthMiddleware);

router.use(roleMiddleware("RESIDENT"));

/**
 * ==========================================
 * DASHBOARD
 * ==========================================
 */

router.get("/dashboard", residentFrontendController.dashboard);

/**
 * ==========================================
 * CREATE COMPLAINT
 * ==========================================
 */

router.get("/create-complaint", residentFrontendController.createComplaint);

/**
 * ==========================================
 * MANAGE COMPLAINTS
 * ==========================================
 */

router.get("/manage-complaints", residentFrontendController.manageComplaints);

/**
 * ==========================================
 * EDIT COMPLAINT
 * ==========================================
 */

router.get("/edit-complaint/:id", residentFrontendController.editComplaint);

/**
 * ==========================================
 * COMPLAINT TRASH
 * ==========================================
 */

router.get("/complaint-trash", residentFrontendController.complaintTrash);

/**
 * ==========================================
 * PROFILE
 * ==========================================
 */

router.get("/profile", residentFrontendController.profile);

module.exports = router;
