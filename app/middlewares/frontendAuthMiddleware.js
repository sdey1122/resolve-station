/**
 * ==========================================
 * Frontend Authentication Middleware
 * ==========================================
 */

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const frontendAuthMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.isDeleted) {
      return res.redirect("/auth/login");
    }

    req.user = user;

    next();
  } catch {
    return res.redirect("/auth/login");
  }
};

module.exports = frontendAuthMiddleware;
