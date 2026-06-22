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
      const userRole = req.user.role?.toUpperCase();

      const roles = allowedRoles.map((role) => role.toUpperCase());

      if (!roles.includes(userRole)) {
        if (req.originalUrl.startsWith("/api")) {
          return res.status(403).json({
            success: false,
            message: "Access denied.",
          });
        }

        return res.redirect("/");
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
