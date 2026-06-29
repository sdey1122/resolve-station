/**
 * ==========================================
 * ADMIN FRONTEND CONTROLLER
 * ==========================================
 */

const User = require("../models/User");

const AuditLog = require("../models/AuditLog");

const Complaint = require("../models/Complaint");

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
   * PENDING COMPLAINTS
   * ==========================================
   */

  /**
   * ==========================================
   * PENDING COMPLAINTS
   * ==========================================
   */

  async pendingComplaints(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;

      const limit = 9;

      const skip = (page - 1) * limit;

      const filter = {
        status: {
          $in: ["SUBMITTED", "RESUBMITTED"],
        },
      };

      const totalComplaints = await Complaint.countDocuments(filter);

      const complaints = await Complaint.find(filter)
        .populate("resident", "name email profileImage")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean();

      const pagination = {
        currentPage: page,

        totalPages: Math.ceil(totalComplaints / limit),

        hasPrevPage: page > 1,

        hasNextPage: page < Math.ceil(totalComplaints / limit),
      };

      /**
       * ==========================================
       * STATISTICS
       * ==========================================
       */

      const pendingCount = await Complaint.countDocuments({
        status: {
          $in: ["SUBMITTED", "RESUBMITTED"],
        },
      });

      const resubmittedCount = await Complaint.countDocuments({
        status: "RESUBMITTED",
      });

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);

      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayRequests = await Complaint.countDocuments({
        createdAt: {
          $gte: today,

          $lt: tomorrow,
        },
      });

      return res.render("admin/pending-complaints", {
        user: req.user,

        complaints,

        pagination,

        stats: {
          pending: pendingCount,

          resubmitted: resubmittedCount,

          today: todayRequests,

          review: pendingCount,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send("Internal Server Error");
    }
  }

  /**
   * ==========================================
   * ALL COMPLAINTS
   * ==========================================
   */

  async allComplaints(req, res) {
    try {
      return res.render("admin/all-complaints", {
        user: req.user,

        complaints: [],
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send("Internal Server Error");
    }
  }

  /**
/**
 * ==========================================
 * REVIEW COMPLAINT
 * ==========================================
 */

  async complaintDetails(req, res) {
    try {
      const complaint = await Complaint.findById(req.params.id)
        .populate("resident", "name email profileImage")
        .populate("assignedStaff", "name email profileImage")
        .populate("assignedBy", "name")
        .populate("closedBy", "name")
        .lean();

      if (!complaint) {
        return res.redirect("/admin/complaints/pending");
      }

      return res.render("admin/complaint-details", {
        user: req.user,

        complaint,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send("Internal Server Error");
    }
  }

  /**
   * ==========================================
   * COMPLETED JOBS WAITING REVIEW
   * ==========================================
   */

  async completedReviews(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;

      const limit = 6;

      const skip = (page - 1) * limit;

      const filter = {
        status: "PENDING_REVIEW",
      };

      /**
       * ==========================================
       * COMPLAINTS
       * ==========================================
       */

      const totalComplaints = await Complaint.countDocuments(filter);

      const complaints = await Complaint.find(filter)
        .populate("resident", "name email profileImage")
        .populate("assignedStaff", "name email profileImage")
        .sort({
          completedAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean();

      /**
       * ==========================================
       * PAGINATION
       * ==========================================
       */

      const pagination = {
        currentPage: page,

        totalPages: Math.ceil(totalComplaints / limit),

        hasPrevPage: page > 1,

        hasNextPage: page < Math.ceil(totalComplaints / limit),
      };

      /**
       * ==========================================
       * STATISTICS
       * ==========================================
       */

      const pendingReview = await Complaint.countDocuments({
        status: "PENDING_REVIEW",
      });

      const completedToday = await Complaint.countDocuments({
        status: "PENDING_REVIEW",

        completedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });

      const totalValue = complaints.reduce(
        (sum, complaint) => sum + (complaint.finalPrice || 0),
        0,
      );

      const avgValue =
        complaints.length > 0 ? Math.round(totalValue / complaints.length) : 0;

      /**
       * ==========================================
       * RENDER
       * ==========================================
       */

      return res.render("admin/completed-reviews", {
        user: req.user,

        complaints,

        pagination,

        stats: {
          pendingReview,

          completedToday,

          totalValue,

          avgValue,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send("Internal Server Error");
    }
  }

  /**
   * ==========================================
   * CANNOT COMPLETE REPORTS
   * ==========================================
   */

  async cannotCompleteReviews(req, res) {
    try {
      const complaints = await Complaint.find({
        status: "CANNOT_COMPLETE",
      })
        .populate("resident", "name profileImage")
        .populate("assignedStaff", "name profileImage")
        .sort({
          updatedAt: -1,
        })
        .lean();

      return res.render("admin/cannot-complete-reviews", {
        user: req.user,

        complaints,
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
