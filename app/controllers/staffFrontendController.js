/**
 * ==========================================
 * Staff Frontend Controller
 * ==========================================
 */

const Complaint = require("../models/Complaint");

class StaffFrontendController {
  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */

  async dashboard(req, res) {
    try {
      const assignedJobs = await Complaint.find({
        assignedStaff: req.user._id,

        status: {
          $in: ["APPROVED", "ASSIGNED", "IN_PROGRESS"],
        },
      })
        .populate("resident", "name profileImage")
        .sort({
          deadlineAt: 1,
        })
        .lean();

      const assigned = assignedJobs.length;

      const inProgress = assignedJobs.filter(
        (job) => job.status === "IN_PROGRESS",
      ).length;

      const completed = await Complaint.countDocuments({
        assignedStaff: req.user._id,

        status: "COMPLETED",
      });

      const overdue = assignedJobs.filter(
        (job) => job.deadlineAt && new Date(job.deadlineAt) < new Date(),
      ).length;

      return res.render("staff/dashboard", {
        user: req.user,

        assignedJobs,

        stats: {
          assigned,

          inProgress,

          completed,

          overdue,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send("Internal Server Error");
    }
  }

  /**
   * ==========================================
   * MY TASKS
   * ==========================================
   */

  async tasks(req, res) {
    try {
      const tasks = await Complaint.find({
        assignedStaff: req.user._id,

        status: {
          $in: ["APPROVED", "CANNOT_COMPLETE"],
        },
      })
        .populate("resident", "name profileImage")
        .sort({
          deadlineAt: 1,
        })
        .lean();

      return res.render("staff/tasks", {
        user: req.user,

        tasks,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).send("Internal Server Error");
    }
  }

  /**
   * ==========================================
   * TASK DETAILS
   * ==========================================
   */

  async taskDetails(req, res) {
    try {
      const complaint = await Complaint.findOne({
        _id: req.params.id,

        assignedStaff: req.user._id,
      })
        .populate("resident", "name email profileImage")
        .lean();

      if (!complaint) {
        return res.redirect("/staff/tasks");
      }

      return res.render("staff/task-details", {
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
   * PROFILE
   * ==========================================
   */

  profile(req, res) {
    return res.render("staff/profile", {
      user: req.user,
    });
  }
}

module.exports = new StaffFrontendController();
