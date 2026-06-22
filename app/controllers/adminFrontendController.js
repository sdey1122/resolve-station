/**
 * ==========================================
 * Admin Frontend Controller
 * ==========================================
 */

class AdminFrontendController {
  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */

  dashboard(req, res) {
    return res.render("admin/dashboard", {
      user: req.user,

      stats: {},

      recentActivities: [],
    });
  }

  /**
   * ==========================================
   * STAFF LIST
   * ==========================================
   */

  staff(req, res) {
    return res.render("admin/staff", {
      user: req.user,

      staff: [],

      activeStaff: 0,

      deletedStaff: 0,

      newStaff: 0,
    });
  }

  /**
   * ==========================================
   * CREATE STAFF
   * ==========================================
   */

  createStaff(req, res) {
    return res.render("admin/staff-create", {
      user: req.user,
    });
  }

  /**
   * ==========================================
   * VIEW STAFF
   * ==========================================
   */

  viewStaff(req, res) {
    return res.render("admin/staff-view", {
      user: req.user,

      staff: {},
    });
  }

  /**
   * ==========================================
   * EDIT STAFF
   * ==========================================
   */

  editStaff(req, res) {
    return res.render("admin/staff-edit", {
      user: req.user,

      staff: {},
    });
  }

  /**
   * ==========================================
   * RESIDENTS
   * ==========================================
   */

  residents(req, res) {
    return res.render("admin/residents", {
      user: req.user,

      residents: [],
    });
  }

  /**
   * ==========================================
   * VIEW RESIDENT
   * ==========================================
   */

  viewResident(req, res) {
    return res.render("admin/resident-view", {
      user: req.user,

      resident: {},

      requests: [],

      stats: {},
    });
  }

  /**
   * ==========================================
   * MAINTENANCE
   * ==========================================
   */

  maintenance(req, res) {
    return res.render("admin/maintenance", {
      user: req.user,

      requests: [],

      stats: {},
    });
  }

  /**
   * ==========================================
   * VIEW MAINTENANCE
   * ==========================================
   */

  maintenanceView(req, res) {
    return res.render("admin/maintenance-view", {
      user: req.user,

      request: {},

      staffs: [],

      timeline: [],
    });
  }

  /**
   * ==========================================
   * TRASH
   * ==========================================
   */

  trash(req, res) {
    return res.render("admin/trash", {
      user: req.user,

      trashItems: [],

      trashStats: {},
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

      logs: [],

      stats: {},
    });
  }
}

module.exports = new AdminFrontendController();
