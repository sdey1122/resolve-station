/**
 * ==========================================
 * COMPLAINT SERVICE
 * ==========================================
 */

const Complaint = require("../models/Complaint");
const User = require("../models/User");

const auditLogService = require("./auditLogService");

const generateComplaintNumber = require("../utils/generateComplaintNumber");

const {
  uploadComplaintImage,
  replaceComplaintImage,
  deleteComplaintImage,
} = require("./cloudinaryService");

/**
 * ==========================================
 * PAYMENT DEDUCTIONS
 * ==========================================
 */

const DUE_DEDUCTION = 0.25;

const OVERDUE_DEDUCTION = 0.5;

class ComplaintService {
  /**
   * ==========================================
   * CREATE COMPLAINT
   * ==========================================
   */

  async createComplaint(data, file, residentUser, ipAddress) {
    const complaintNumber = await generateComplaintNumber();

    /**
     * Daily Complaint Limit
     */

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const complaintsToday = await Complaint.countDocuments({
      resident: residentUser._id,

      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (complaintsToday >= 3) {
      throw new Error(
        "You have reached the maximum limit of 3 complaints for today.",
      );
    }

    /**
     * Complaint Image
     */

    let image = {
      publicId: null,
      url: null,
      uploadedAt: null,
    };

    if (file) {
      const uploadedImage = await uploadComplaintImage(file.buffer);

      image = {
        publicId: uploadedImage.publicId,
        url: uploadedImage.url,
        uploadedAt: uploadedImage.uploadedAt || new Date(),
      };
    }

    /**
     * Create Complaint
     */

    const complaint = await Complaint.create({
      complaintNumber,

      resident: residentUser._id,

      title: data.title.trim(),

      category: data.category,

      description: data.description.trim(),

      incidentDate: data.incidentDate,

      incidentTime: data.incidentTime,

      image,

      timeline: [
        {
          action: "COMPLAINT_CREATED",

          performedBy: residentUser._id,

          description: "Complaint created by resident.",
        },
      ],
    });

    /**
     * Audit Log
     */

    await auditLogService.createLog({
      performedBy: residentUser._id,

      role: residentUser.role,

      action: "CREATE_COMPLAINT",

      details: `Created complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint submitted successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * GET RESIDENT COMPLAINTS
   * ==========================================
   */

  async getResidentComplaints(residentId) {
    const complaints = await Complaint.find({
      resident: residentId,

      isDeleted: false,
    })
      .populate("assignedStaff", "name profileImage")
      .sort({
        createdAt: -1,
      });

    return {
      success: true,

      count: complaints.length,

      complaints,
    };
  }

  /**
   * ==========================================
   * GET COMPLAINT BY ID
   * ==========================================
   */

  async getComplaintById(complaintId, residentId) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      resident: residentId,

      isDeleted: false,
    })
      .populate("assignedStaff", "name email profileImage")
      .populate("assignedBy", "name")
      .populate("closedBy", "name");

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    return {
      success: true,

      complaint,
    };
  }

  /**
   * ==========================================
   * UPDATE COMPLAINT
   * ==========================================
   */

  async updateComplaint(complaintId, data, file, residentUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      resident: residentUser._id,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (
      complaint.status !== "SUBMITTED" &&
      complaint.status !== "REJECTED" &&
      complaint.status !== "RESUBMITTED"
    ) {
      throw new Error("This complaint can no longer be edited.");
    }

    complaint.title = data.title.trim();

    complaint.category = data.category;

    complaint.description = data.description.trim();

    complaint.incidentDate = data.incidentDate;

    complaint.incidentTime = data.incidentTime;

    /**
     * Replace Image
     */

    if (file) {
      const uploadedImage = await replaceComplaintImage(
        complaint.image?.publicId,
        file.buffer,
      );

      complaint.image = {
        publicId: uploadedImage.publicId,

        url: uploadedImage.url,

        uploadedAt: uploadedImage.uploadedAt || new Date(),
      };
    }

    /**
     * Resubmission
     */

    if (complaint.status === "REJECTED") {
      complaint.status = "RESUBMITTED";
    }

    complaint.timeline.push({
      action: "COMPLAINT_UPDATED",

      performedBy: residentUser._id,

      description: "Complaint updated by resident.",
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: residentUser._id,

      role: residentUser.role,

      action: "UPDATE_COMPLAINT",

      details: `Updated complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint updated successfully.",

      complaint,
    };
  }
  /**
   * ==========================================
   * GET DELETED COMPLAINTS
   * ==========================================
   */

  async getDeletedComplaints(residentId) {
    const complaints = await Complaint.find({
      resident: residentId,

      isDeleted: true,
    })
      .populate("assignedStaff", "name profileImage")
      .sort({
        deletedAt: -1,
      });

    return {
      success: true,

      count: complaints.length,

      complaints,
    };
  }

  /**
   * ==========================================
   * SOFT DELETE COMPLAINT
   * ==========================================
   */

  async deleteComplaint(complaintId, residentUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      resident: residentUser._id,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    /**
     * Prevent deletion after approval
     */

    if (
      complaint.status !== "SUBMITTED" &&
      complaint.status !== "REJECTED" &&
      complaint.status !== "RESUBMITTED"
    ) {
      throw new Error("This complaint can no longer be deleted.");
    }

    complaint.isDeleted = true;

    complaint.deletedAt = new Date();

    complaint.timeline.push({
      action: "COMPLAINT_DELETED",

      performedBy: residentUser._id,

      description: "Complaint moved to Complaint Trash.",
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: residentUser._id,

      role: residentUser.role,

      action: "DELETE_COMPLAINT",

      details: `Moved complaint (${complaint.complaintNumber}) to Complaint Trash`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint moved to Complaint Trash successfully.",
    };
  }

  /**
   * ==========================================
   * RESTORE COMPLAINT
   * ==========================================
   */

  async restoreComplaint(complaintId, residentUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      resident: residentUser._id,

      isDeleted: true,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    complaint.isDeleted = false;

    complaint.deletedAt = null;

    complaint.timeline.push({
      action: "COMPLAINT_RESTORED",

      performedBy: residentUser._id,

      description: "Complaint restored from Complaint Trash.",
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: residentUser._id,

      role: residentUser.role,

      action: "RESTORE_COMPLAINT",

      details: `Restored complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint restored successfully.",
    };
  }

  /**
   * ==========================================
   * PERMANENT DELETE COMPLAINT
   * ==========================================
   */

  async permanentlyDeleteComplaint(complaintId, residentUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      resident: residentUser._id,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    /**
     * Delete Cloudinary Image
     */

    if (complaint.image?.publicId) {
      await deleteComplaintImage(complaint.image.publicId);
    }

    const complaintNumber = complaint.complaintNumber;

    await Complaint.findByIdAndDelete(complaintId);

    await auditLogService.createLog({
      performedBy: residentUser._id,

      role: residentUser.role,

      action: "PERMANENT_DELETE_COMPLAINT",

      details: `Permanently deleted complaint (${complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint permanently deleted.",
    };
  }
  /**
   * ==========================================
   * GET ALL COMPLAINTS (ADMIN)
   * ==========================================
   */

  async getAllComplaints() {
    const complaints = await Complaint.find({
      isDeleted: false,
    })
      .populate("resident", "name email profileImage")
      .populate("assignedStaff", "name profileImage")
      .sort({
        createdAt: -1,
      });

    return {
      success: true,

      count: complaints.length,

      complaints,
    };
  }

  /**
   * ==========================================
   * GET COMPLAINT BY ID (ADMIN)
   * ==========================================
   */

  async getComplaintDetails(complaintId) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      isDeleted: false,
    })
      .populate("resident", "name email profileImage")
      .populate("assignedStaff", "name email profileImage")
      .populate("assignedBy", "name")
      .populate("closedBy", "name");

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    return {
      success: true,

      complaint,
    };
  }

  /**
   * ==========================================
   * APPROVE COMPLAINT
   * ==========================================
   */

  async approveComplaint(complaintId, adminUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (
      complaint.status !== "SUBMITTED" &&
      complaint.status !== "RESUBMITTED"
    ) {
      throw new Error("Only submitted complaints can be approved.");
    }

    complaint.status = "APPROVED";

    complaint.adminRemark = "";

    complaint.timeline.push({
      action: "COMPLAINT_APPROVED",

      performedBy: adminUser._id,

      description: "Complaint approved by administrator.",
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "APPROVE_COMPLAINT",

      details: `Approved complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint approved successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * REJECT COMPLAINT
   * ==========================================
   */

  async rejectComplaint(complaintId, remark, adminUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (
      complaint.status !== "SUBMITTED" &&
      complaint.status !== "RESUBMITTED"
    ) {
      throw new Error("Only submitted complaints can be rejected.");
    }

    if (!remark || !remark.trim()) {
      throw new Error("Please provide a rejection remark.");
    }

    complaint.status = "REJECTED";

    complaint.adminRemark = remark.trim();

    complaint.timeline.push({
      action: "COMPLAINT_REJECTED",

      performedBy: adminUser._id,

      description: `Complaint rejected. Remark: ${remark.trim()}`,
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "REJECT_COMPLAINT",

      details: `Rejected complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint rejected successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * ASSIGN STAFF
   * ==========================================
   */

  async assignStaff(complaintId, data, adminUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (complaint.status !== "APPROVED") {
      throw new Error("Only approved complaints can be assigned.");
    }

    /**
     * ==========================================
     * STAFF
     * ==========================================
     */

    const staff = await User.findOne({
      _id: data.staffId,

      role: "STAFF",

      isDeleted: false,
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    /**
     * ==========================================
     * ESTIMATED PRICE
     * ==========================================
     */

    const estimatedPrice = Number(data.estimatedPrice);

    if (isNaN(estimatedPrice) || estimatedPrice <= 0) {
      throw new Error("Invalid estimated price.");
    }

    /**
     * ==========================================
     * DEADLINE
     * ==========================================
     */

    let deadlineHours;

    let priority;

    switch (data.deadlineType) {
      case "VERY_URGENT":
        deadlineHours = 6;
        priority = "VERY_URGENT";
        break;

      case "URGENT":
        deadlineHours = 12;
        priority = "URGENT";
        break;

      case "NORMAL":
        deadlineHours = 24;
        priority = "NORMAL";
        break;

      case "DUE":
        deadlineHours = 36;
        priority = "DUE";
        break;

      case "CUSTOM":
        deadlineHours = Number(data.customHours);

        if (isNaN(deadlineHours) || deadlineHours <= 0) {
          throw new Error("Invalid custom deadline.");
        }

        if (deadlineHours <= 6) {
          priority = "VERY_URGENT";
        } else if (deadlineHours <= 12) {
          priority = "URGENT";
        } else if (deadlineHours <= 24) {
          priority = "NORMAL";
        } else if (deadlineHours <= 36) {
          priority = "DUE";
        } else {
          priority = "OVERDUE";
        }

        break;

      default:
        throw new Error("Invalid deadline.");
    }

    const deadline = new Date();

    deadline.setHours(deadline.getHours() + deadlineHours);

    /**
     * ==========================================
     * ASSIGN
     * ==========================================
     */

    complaint.assignedStaff = staff._id;

    complaint.assignedBy = adminUser._id;

    complaint.status = "ASSIGNED";

    complaint.priority = priority;

    complaint.estimatedPrice = estimatedPrice;

    complaint.finalPrice = estimatedPrice;

    complaint.deadline = deadline;

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "STAFF_ASSIGNED",

      performedBy: adminUser._id,

      description: `Assigned to ${staff.name}.`,
    });

    await complaint.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "ASSIGN_STAFF",

      details: `Assigned ${staff.name} to complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Staff assigned successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * START WORK
   * ==========================================
   */

  async startWork(complaintId, staffUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      assignedStaff: staffUser._id,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (complaint.status !== "ASSIGNED") {
      throw new Error("This complaint cannot be started.");
    }

    complaint.status = "IN_PROGRESS";

    complaint.startedAt = new Date();

    complaint.timeline.push({
      action: "WORK_STARTED",

      performedBy: staffUser._id,

      description: "Maintenance work started.",
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: staffUser._id,

      role: staffUser.role,

      action: "START_WORK",

      details: `Started work on complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Work started successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * COMPLETE WORK
   * ==========================================
   */

  async completeWork(complaintId, staffUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      assignedStaff: staffUser._id,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (complaint.status !== "IN_PROGRESS") {
      throw new Error("Only active work can be completed.");
    }

    const completedAt = new Date();

    const estimatedPrice = complaint.estimatedPrice;

    let finalPrice = estimatedPrice;

    /**
     * ==========================================
     * PAYMENT CALCULATION
     * ==========================================
     */

    if (completedAt > complaint.deadline) {
      const hoursLate = (completedAt - complaint.deadline) / (1000 * 60 * 60);

      if (hoursLate <= 12) {
        finalPrice = estimatedPrice * (1 - DUE_DEDUCTION);
      } else {
        finalPrice = estimatedPrice * (1 - OVERDUE_DEDUCTION);
      }
    }

    complaint.status = "COMPLETED";

    complaint.completedAt = completedAt;

    complaint.finalPrice = Math.round(finalPrice);

    complaint.timeline.push({
      action: "WORK_COMPLETED",

      performedBy: staffUser._id,

      description: "Complaint completed successfully.",
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: staffUser._id,

      role: staffUser.role,

      action: "COMPLETE_WORK",

      details: `Completed complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint completed successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * CANNOT COMPLETE WORK
   * ==========================================
   */

  async cannotCompleteWork(complaintId, remark, staffUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      assignedStaff: staffUser._id,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (complaint.status !== "IN_PROGRESS") {
      throw new Error("Only active complaints can be updated.");
    }

    if (!remark || !remark.trim()) {
      throw new Error("Please provide a reason.");
    }

    complaint.status = "CANNOT_COMPLETE";

    complaint.staffRemark = remark.trim();

    complaint.completedAt = new Date();

    complaint.finalPrice = 0;

    complaint.timeline.push({
      action: "WORK_CANNOT_COMPLETE",

      performedBy: staffUser._id,

      description: remark.trim(),
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: staffUser._id,

      role: staffUser.role,

      action: "WORK_CANNOT_COMPLETE",

      details: `Unable to complete complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint updated successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * CLOSE COMPLAINT
   * ==========================================
   */

  async closeComplaint(complaintId, adminUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (
      complaint.status !== "COMPLETED" &&
      complaint.status !== "CANNOT_COMPLETE"
    ) {
      throw new Error("Only completed complaints can be closed.");
    }

    complaint.status = "CLOSED";

    complaint.closedBy = adminUser._id;

    complaint.closedAt = new Date();

    complaint.timeline.push({
      action: "COMPLAINT_CLOSED",

      performedBy: adminUser._id,

      description: "Complaint closed.",
    });

    await complaint.save();

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "CLOSE_COMPLAINT",

      details: `Closed complaint (${complaint.complaintNumber})`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint closed successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * REASSIGN COMPLAINT
   * ==========================================
   */

  async reassignComplaint(complaintId, data, adminUser, ipAddress) {
    const complaint = await Complaint.findOne({
      _id: complaintId,

      isDeleted: false,
    });

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    if (complaint.status !== "CANNOT_COMPLETE") {
      throw new Error("Only unresolved complaints can be reassigned.");
    }

    /**
     * ==========================================
     * STAFF
     * ==========================================
     */

    const staff = await User.findOne({
      _id: data.staffId,

      role: "STAFF",

      isDeleted: false,
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    if (
      complaint.assignedStaff &&
      complaint.assignedStaff.toString() === staff._id.toString()
    ) {
      throw new Error("Please select a different staff member.");
    }

    /**
     * ==========================================
     * OPTIONAL DEADLINE
     * ==========================================
     */

    if (data.deadlineHours) {
      const deadline = new Date();

      deadline.setHours(deadline.getHours() + Number(data.deadlineHours));

      complaint.deadline = deadline;
    }

    /**
     * ==========================================
     * REASSIGN
     * ==========================================
     */

    complaint.assignedStaff = staff._id;

    complaint.assignedBy = adminUser._id;

    complaint.status = "ASSIGNED";

    complaint.startedAt = null;

    complaint.completedAt = null;

    complaint.staffRemark = "";

    complaint.finalPrice = complaint.estimatedPrice;

    complaint.timeline.push({
      action: "COMPLAINT_REASSIGNED",

      performedBy: adminUser._id,

      description: `Reassigned to ${staff.name}.`,
    });

    await complaint.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "REASSIGN_COMPLAINT",

      details: `Reassigned complaint (${complaint.complaintNumber}) to ${staff.name}`,

      ipAddress,
    });

    return {
      success: true,

      message: "Complaint reassigned successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * RESIDENT DASHBOARD
   * ==========================================
   */

  async getResidentDashboard(residentId) {
    const [
      totalComplaints,
      pendingComplaints,
      assignedComplaints,
      completedComplaints,
      recentComplaints,
    ] = await Promise.all([
      Complaint.countDocuments({
        resident: residentId,
        isDeleted: false,
      }),

      Complaint.countDocuments({
        resident: residentId,
        status: {
          $in: ["SUBMITTED", "RESUBMITTED", "APPROVED"],
        },
        isDeleted: false,
      }),

      Complaint.countDocuments({
        resident: residentId,
        status: {
          $in: ["ASSIGNED", "IN_PROGRESS"],
        },
        isDeleted: false,
      }),

      Complaint.countDocuments({
        resident: residentId,
        status: "COMPLETED",
        isDeleted: false,
      }),

      Complaint.find({
        resident: residentId,
        isDeleted: false,
      })
        .populate("assignedStaff", "name profileImage")
        .sort({
          createdAt: -1,
        })
        .limit(6),
    ]);

    return {
      stats: {
        totalComplaints,

        pendingComplaints,

        assignedComplaints,

        completedComplaints,
      },

      recentComplaints,
    };
  }
}

module.exports = new ComplaintService();
