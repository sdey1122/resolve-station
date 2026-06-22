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

  /**
   * ==========================================
   * ASSIGNED JOBS
   * ==========================================
   */

  assignedJobs(req, res) {
    return res.render("staff/assigned-jobs", {
      user: req.user,

      jobs: [],
    });
  }

  /**
   * ==========================================
   * PERFORMANCE
   * ==========================================
   */

  performance(req, res) {
    return res.render("staff/performance", {
      user: req.user,

      stats: {},
    });
  }

  /**
   * ==========================================
   * VIEW JOB
   * ==========================================
   */

  viewJob(req, res) {
    return res.render("staff/job-view", {
      user: req.user,

      job: {},

      resident: {},
    });
  }
}

module.exports = new StaffFrontendController();
