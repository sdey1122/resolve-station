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

module.exports = router;
