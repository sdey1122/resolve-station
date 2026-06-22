/**
 * ==========================================
 * Not Found Middleware
 * ==========================================
 */

const notFoundMiddleware = (req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: "Route not found.",
    });
  }

  return res.status(404).render("errors/404");
};

module.exports = notFoundMiddleware;
