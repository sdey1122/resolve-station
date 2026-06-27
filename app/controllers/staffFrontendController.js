/**
 * ==========================================
 * Staff Frontend Controller
 * ==========================================
 */

class StaffFrontendController {
  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */

  dashboard(req, res) {
    return res.render("staff/dashboard", {
      user: req.user,

      stats: {},

      assignedJobs: [],
    });
  }
}

module.exports = new StaffFrontendController();
