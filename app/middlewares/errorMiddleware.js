/**
 * ==========================================
 * Error Middleware
 * ==========================================
 */

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  return res.render("errors/500", {
    error: process.env.NODE_ENV === "production" ? null : err,
  });
};

module.exports = errorMiddleware;
