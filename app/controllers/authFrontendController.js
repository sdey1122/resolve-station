/**
 * ==========================================
 * Auth Frontend Controller
 * ==========================================
 */

class AuthFrontendController {
  login(req, res) {
    return res.render("auth/login");
  }

  register(req, res) {
    return res.render("auth/register");
  }

  forgotPassword(req, res) {
    return res.render("auth/forgot-password");
  }

  resetPassword(req, res) {
    return res.render("auth/reset-password", {
      token: req.params.token,
    });
  }

  verifyEmail(req, res) {
    return res.render("auth/verify-email");
  }

  verifySuccess(req, res) {
    return res.render("auth/verify-success");
  }

  verifyFailed(req, res) {
    return res.render("auth/verify-failed");
  }

  accountLocked(req, res) {
    return res.render("auth/account-locked");
  }
}

module.exports = new AuthFrontendController();
