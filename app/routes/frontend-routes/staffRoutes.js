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

/**
 * ==========================================
 * DASHBOARD
 * ==========================================
 */

router.get("/dashboard", staffFrontendController.dashboard);

/**
 * ==========================================
 * TASKS
 * ==========================================
 */

router.get("/tasks", staffFrontendController.tasks);

/**
 * ==========================================
 * TASK DETAILS
 * ==========================================
 */

router.get("/tasks/:id", staffFrontendController.taskDetails);

/**
 * ==========================================
 * PROFILE
 * ==========================================
 */

router.get("/profile", staffFrontendController.profile);

module.exports = router;
