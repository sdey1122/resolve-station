const express = require("express");

const router = express.Router();

const frontendAuthMiddleware = require("../../middlewares/frontendAuthMiddleware");

const roleMiddleware = require("../../middlewares/roleMiddleware");

const staffFrontendController = require("../../controllers/staffFrontendController");

/**
 * ==========================================
 * PROTECTED STAFF ROUTES
 * ==========================================
 */

router.use(frontendAuthMiddleware);

router.use(roleMiddleware("STAFF"));

/**
 * ==========================================
 * DASHBOARD
 * ==========================================
 */

router.get("/dashboard", staffFrontendController.dashboard);

router.get("/performance", staffFrontendController.performance);

/**
 * ==========================================
 * ASSIGNED JOBS
 * ==========================================
 */

router.get("/assigned-jobs", staffFrontendController.assignedJobs);
/**
 * ==========================================
 * PERFORMANCE
 * ==========================================
 */

router.get("/performance", staffFrontendController.performance);

router.get("/jobs/:id", staffFrontendController.viewJob);

module.exports = router;
