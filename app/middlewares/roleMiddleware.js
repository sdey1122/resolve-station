/**
 * ==========================================
 * Role Middleware
 * ==========================================
 */

const roleMiddleware =
  (...allowedRoles) =>
  (req, res, next) => {
    try {
      /**
       * USER NOT AUTHENTICATED
       */

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      /**
       * ROLE CHECK
       */

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied!
          Required role: ${allowedRoles.join(", ")}`,
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Role authorization failed.",
      });
    }
  };

module.exports = roleMiddleware;
