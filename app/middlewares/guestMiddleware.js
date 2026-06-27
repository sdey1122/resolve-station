/**
 * ==========================================
 * Guest Middleware
 * ==========================================
 */

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const guestMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next();
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.isDeleted) {
      return next();
    }
    switch (user.role) {
      case "ADMIN":
        return res.redirect("/admin/dashboard");

      case "STAFF":
        return res.redirect("/staff/dashboard");

      case "RESIDENT":
        return res.redirect("/resident/dashboard");

      default:
        return next();
    }
  } catch {
    return next();
  }
};

module.exports = guestMiddleware;
