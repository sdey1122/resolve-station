/**
 * ==========================================
 * Staff Service
 * ==========================================
 */

const Complaint = require("../models/Complaint");

const cloudinary = require("../config/cloudinaryConfig");

const auditLogService = require("./auditLogService");

class StaffService {
  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */

  async dashboard(user) {
    return {
      success: true,

      message: "Welcome Staff Dashboard.",

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,
      },
    };
  }

  /**
   * ==========================================
   * COMPLETE COMPLAINT
   * ==========================================
   */

  async completeComplaint(user, complaintId, file) {
    /**
     * ==========================================
     * FIND COMPLAINT
     * ==========================================
     */

    const complaint = await Complaint.findOne({
      _id: complaintId,

      assignedStaff: user._id,
    });

    if (!complaint) {
      return {
        success: false,

        message: "Assigned complaint not found.",
      };
    }

    /**
     * ==========================================
     * ALREADY COMPLETED
     * ==========================================
     */

    if (complaint.status === "COMPLETED" || complaint.status === "CLOSED") {
      return {
        success: false,

        message: "Complaint has already been completed.",
      };
    }

    /**
     * ==========================================
     * IMAGE VALIDATION
     * ==========================================
     */

    if (!file) {
      return {
        success: false,

        message: "Completion proof image is required.",
      };
    }

    /**
     * ==========================================
     * UPLOAD COMPLETION IMAGE
     * ==========================================
     */

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "ResolveStation/completion-proofs",
    });

    /**
     * ==========================================
     * PRICE CALCULATION
     * ==========================================
     */

    const estimatedPrice = complaint.estimatedPrice || 0;

    let finalPrice = estimatedPrice;

    let deductionPercent = 0;

    if (complaint.deadlineAt) {
      const deadline = new Date(complaint.deadlineAt);

      const now = new Date();

      const overdueHours =
        (now.getTime() - deadline.getTime()) / (1000 * 60 * 60);

      /**
       * BEFORE DEADLINE
       */

      if (overdueHours <= 0) {
        deductionPercent = 0;

        finalPrice = estimatedPrice;
      } else if (overdueHours <= 12) {
        /**
         * DUE
         */
        deductionPercent = 25;

        finalPrice = Math.round(estimatedPrice * 0.75);
      } else if (overdueHours <= 24) {
        /**
         * OVERDUE
         */
        deductionPercent = 50;

        finalPrice = Math.round(estimatedPrice * 0.5);
      } else {
        /**
         * EXPIRED
         */
        deductionPercent = 100;

        finalPrice = 0;
      }
    }

    /**
     * ==========================================
     * SAVE COMPLETION
     * ==========================================
     */

    complaint.status = "PENDING_REVIEW";

    complaint.completedAt = new Date();

    complaint.closedBy = user._id;

    complaint.completionRemark = "Maintenance completed successfully.";

    complaint.finalPrice = finalPrice;

    complaint.deductionPercent = deductionPercent;

    complaint.completionImage = {
      publicId: uploadResult.public_id,

      url: uploadResult.secure_url,

      uploadedAt: new Date(),
    };

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "WORK_COMPLETED",

      performedBy: user._id,

      description:
        "Staff completed the assigned maintenance and uploaded proof image.",
    });

    await complaint.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: user._id,

      role: user.role,

      action: "STAFF_COMPLETED_COMPLAINT",

      targetUser: complaint.resident,

      details: `Completed complaint ${complaint.complaintNumber}.`,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,

      message:
        "Maintenance work submitted successfully and is awaiting administrator approval.",

      complaint,
    };
  }

  /**
   * ==========================================
   * CANNOT COMPLETE COMPLAINT
   * ==========================================
   */

  async cannotCompleteComplaint(user, complaintId, data) {
    const { remark } = data;

    /**
     * ==========================================
     * FIND COMPLAINT
     * ==========================================
     */

    const complaint = await Complaint.findOne({
      _id: complaintId,

      assignedStaff: user._id,
    });

    if (!complaint) {
      return {
        success: false,

        message: "Assigned complaint not found.",
      };
    }

    /**
     * ==========================================
     * VALIDATION
     * ==========================================
     */

    if (!remark || !remark.trim()) {
      return {
        success: false,

        message: "Please provide a reason for not completing the work.",
      };
    }

    /**
     * ==========================================
     * UPDATE COMPLAINT
     * ==========================================
     */

    complaint.status = "CANNOT_COMPLETE";

    complaint.cannotCompleteRemark = remark.trim();

    complaint.completedAt = null;

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "CANNOT_COMPLETE",

      performedBy: user._id,

      description: `Unable to complete maintenance. Reason: ${remark.trim()}`,
    });

    await complaint.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: user._id,

      role: user.role,

      action: "STAFF_CANNOT_COMPLETE",

      targetUser: complaint.resident,

      details: `Complaint ${complaint.complaintNumber} could not be completed.`,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,

      message:
        "Your report has been submitted successfully. The administrator will review the complaint.",

      complaint,
    };
  }
}

module.exports = new StaffService();
