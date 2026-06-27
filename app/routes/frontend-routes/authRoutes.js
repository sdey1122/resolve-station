const express = require("express");

const router = express.Router();

const guestMiddleware = require("../../middlewares/guestMiddleware");

const authFrontendController = require("../../controllers/authFrontendController");

// router.use(guestMiddleware);

router.get("/verify-email", authFrontendController.verifyEmail);

router.get("/verify-success", authFrontendController.verifySuccess);

router.get("/verify-failed", authFrontendController.verifyFailed);

router.use(guestMiddleware);

router.get("/login", authFrontendController.login);

router.get("/register", authFrontendController.register);

router.get("/forgot-password", authFrontendController.forgotPassword);

router.get("/reset-password/:token", authFrontendController.resetPassword);

router.get("/account-locked", authFrontendController.accountLocked);

module.exports = router;
