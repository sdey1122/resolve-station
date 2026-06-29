/**
 * ==========================================
 * Staff API Routes
 * ==========================================
 */

const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middlewares/authMiddleware");

const roleMiddleware = require("../../middlewares/roleMiddleware");

const upload = require("../../middlewares/uploadMiddleware");

const staffController = require("../../controllers/staffController");

/**
 * ==========================================
 * MIDDLEWARE
 * ==========================================
 */

const staffOnly = [authMiddleware, roleMiddleware("STAFF")];

/**
 * ==========================================
 * DASHBOARD
 * ==========================================
 */

router.get("/dashboard", ...staffOnly, staffController.dashboard);

/**
 * ==========================================
 * COMPLETE COMPLAINT
 * ==========================================
 */

router.patch(
  "/complaints/:id/complete",
  ...staffOnly,
  upload.single("completionImage"),
  staffController.completeComplaint,
);

/**
 * ==========================================
 * CANNOT COMPLETE
 * ==========================================
 */

router.patch(
  "/complaints/:id/cannot-complete",
  ...staffOnly,
  staffController.cannotCompleteComplaint,
);

/**
 * ==========================================
 * EXPORT
 * ==========================================
 */

module.exports = router;
