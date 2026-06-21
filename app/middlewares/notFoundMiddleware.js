/**
 * ==========================================
 * Not Found Middleware
 * ==========================================
 */

const notFoundMiddleware = (req, res, next) => {
  res.status(404);

  return res.render("errors/404");
};

module.exports = notFoundMiddleware;
