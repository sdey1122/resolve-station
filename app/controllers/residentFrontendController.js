/**
 * ==========================================
 * Resident Frontend Controller
 * ==========================================
 */

class ResidentFrontendController {
  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */

  dashboard(req, res) {
    return res.render("resident/dashboard", {
      user: req.user,

      stats: {},
    });
  }
}

module.exports = new ResidentFrontendController();
