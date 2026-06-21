/**
 * ==========================================
 * Authentication Middleware
 * ==========================================
 */

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const accessToken = req.cookies.accessToken || bearerToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "This account has been removed.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first.",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
    });
  }
};

module.exports = authMiddleware;
