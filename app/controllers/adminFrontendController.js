/**
 * ==========================================
 * ADMIN FRONTEND CONTROLLER
 * ==========================================
 */

const User = require("../models/User");

const AuditLog = require("../models/AuditLog");

class AdminFrontendController {
  /**
   * ==========================================
   * ADMIN DASHBOARD
   * ==========================================
   */

  async dashboard(req, res) {
    try {
      const totalStaff = await User.countDocuments({
        role: "STAFF",
        isDeleted: false,
      });

      const totalResidents = await User.countDocuments({
        role: "RESIDENT",
        isDeleted: false,
      });

      const deletedUsers = await User.countDocuments({
        isDeleted: true,
      });

      const auditLogs = await AuditLog.countDocuments();

      return res.render("admin/dashboard", {
        user: req.user,

        stats: {
          totalStaff,
          totalResidents,
          deletedUsers,
          auditLogs,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send("Internal Server Error");
    }
  }

  /**
   * ==========================================
   * STAFF PAGES
   * ==========================================
   */

  manageStaff(req, res) {
    return res.render("admin/manage-staff", {
      user: req.user,

      staffId: req.params.id || null,
    });
  }

  showStaff(req, res) {
    return res.render("admin/show-staff", {
      user: req.user,
    });
  }
  /**
   * ==========================================
   * RESIDENT PAGES
   * ==========================================
   */

  manageResident(req, res) {
    return res.render("admin/manage-resident", {
      user: req.user,

      residentId: req.params.id || null,
    });
  }

  showResident(req, res) {
    return res.render("admin/show-resident", {
      user: req.user,
    });
  }

  /**
   * ==========================================
   * ACCOUNT TRASH
   * ==========================================
   */

  async accountTrash(req, res) {
    try {
      return res.render("admin/account-trash", {
        user: req.user,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send("Internal Server Error");
    }
  }

  /**
   * ==========================================
   * ADMIN PROFILE
   * ==========================================
   */

  profile(req, res) {
    return res.render("admin/profile", {
      user: req.user,
    });
  }

  /**
   * ==========================================
   * AUDIT LOGS
   * ==========================================
   */

  auditLogs(req, res) {
    return res.render("admin/audit-logs", {
      user: req.user,
    });
  }
}

module.exports = new AdminFrontendController();
