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

module.exports = router;
