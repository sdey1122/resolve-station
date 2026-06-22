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

  /**
   * ==========================================
   * COMPLAINTS
   * ==========================================
   */

  complaints(req, res) {
    return res.render("resident/complaints", {
      user: req.user,

      complaints: [],

      stats: {},
    });
  }

  /**
   * ==========================================
   * MAINTENANCE
   * ==========================================
   */

  maintenance(req, res) {
    return res.render("resident/maintenance", {
      user: req.user,

      requests: [],
    });
  }
}

module.exports = new ResidentFrontendController();
