/**
 * ==========================================
 * Error Middleware
 * ==========================================
 */

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  /**
   * API ROUTE
   */

  if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }

  /**
   * FRONTEND ROUTE
   */

  return res.status(statusCode).render("errors/500", {
    error: process.env.NODE_ENV === "production" ? null : err,
  });
};

module.exports = errorMiddleware;
