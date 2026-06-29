/**
 * ==========================================
 * RESIDENT FRONTEND CONTROLLER
 * ==========================================
 */
const complaintService = require("../services/complaintService");

class ResidentFrontendController {
  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */

  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */

  async dashboard(req, res) {
    try {
      const dashboardData = await complaintService.getResidentDashboard(
        req.user._id,
      );

      return res.render("resident/dashboard", {
        user: req.user,

        stats: dashboardData.stats,

        complaints: dashboardData.recentComplaints,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).render("error", {
        message: "Failed to load dashboard.",
      });
    }
  }

  /**
   * ==========================================
   * MANAGE COMPLAINTS
   * ==========================================
   */

  manageComplaints(req, res) {
    return res.render("resident/manage-complaints", {
      user: req.user,
    });
  }

  /**
   * ==========================================
   * CREATE COMPLAINT
   * ==========================================
   */

  createComplaint(req, res) {
    return res.render("resident/create-complaint", {
      user: req.user,
    });
  }

  /**
   * ==========================================
   * EDIT COMPLAINT
   * ==========================================
   */

  editComplaint(req, res) {
    return res.render("resident/edit-complaint", {
      user: req.user,

      complaintId: req.params.id,
    });
  }

  /**
   * ==========================================
   * COMPLAINT TRASH
   * ==========================================
   */

  complaintTrash(req, res) {
    return res.render("resident/complaint-trash", {
      user: req.user,
    });
  }

  /**
   * ==========================================
   * PROFILE
   * ==========================================
   */

  profile(req, res) {
    return res.render("resident/profile", {
      user: req.user,
    });
  }
}

module.exports = new ResidentFrontendController();
