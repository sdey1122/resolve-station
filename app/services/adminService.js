/**
 * ==========================================
 * ADMIN SERVICE
 * ==========================================
 */

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");

const Complaint = require("../models/Complaint");

const auditLogService = require("./auditLogService");

const {
  uploadProfileImage,
  replaceProfileImage,
  deleteProfileImage,
} = require("./cloudinaryService");

const {
  sendStaffCredentialsEmail,
  sendVerificationEmail,
} = require("./emailService");

const generatePassword = require("../utils/generatePassword");

/**
 * ==========================================
 * CONSTANTS
 * ==========================================
 */

const SALT_ROUNDS = 12;

const DEFAULT_PROFILE_IMAGE = {
  publicId: null,
  url: process.env.DEFAULT_AVATAR_URL,
  uploadedAt: null,
};

class AdminService {
  /**
   * ==========================================
   * CREATE STAFF
   * ==========================================
   */

  async createStaff(data, file, adminUser, ipAddress) {
    const name = data.name.trim();

    const email = data.email.toLowerCase().trim();

    /**
     * ==========================================
     * CHECK EXISTING ACCOUNT
     * ==========================================
     */

    const existingUser = await User.findOne({
      email,
      isDeleted: false,
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    /**
     * ==========================================
     * PROFILE IMAGE
     * ==========================================
     */

    let profileImage = {
      ...DEFAULT_PROFILE_IMAGE,
    };

    if (file) {
      const uploadedImage = await uploadProfileImage(file.buffer);

      profileImage = {
        publicId: uploadedImage.publicId,
        url: uploadedImage.url,
        uploadedAt: uploadedImage.uploadedAt || new Date(),
      };
    }

    /**
     * ==========================================
     * PASSWORD
     * ==========================================
     */

    const temporaryPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(temporaryPassword, SALT_ROUNDS);

    /**
     * ==========================================
     * CREATE STAFF
     * ==========================================
     */

    const staff = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "STAFF",
      profileImage,
      isVerified: true,
    });

    /**
     * ==========================================
     * SEND CREDENTIALS
     * ==========================================
     */

    try {
      await sendStaffCredentialsEmail(staff, temporaryPassword);
    } catch (error) {
      console.error("Staff email failed:", error);
    }

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "CREATE_STAFF",
      targetUser: staff._id,
      details: `Created staff account (${staff.email})`,
      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,
      message: "Staff account created successfully.",
      staff,
    };
  }
  /**
   * ==========================================
   * GET ALL STAFF
   * ==========================================
   */

  async getAllStaff() {
    const staff = await User.find({
      role: "STAFF",
      isDeleted: false,
    })
      .select(
        "name email role profileImage isVerified lastLoginAt lastLoginIP createdAt",
      )
      .sort({
        createdAt: -1,
      });

    return {
      success: true,
      count: staff.length,
      staff,
    };
  }
  /**
   * ==========================================
   * GET STAFF BY ID
   * ==========================================
   */

  async getStaffById(staffId) {
    const staff = await User.findOne({
      _id: staffId,
      role: "STAFF",
      isDeleted: false,
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    return {
      success: true,
      staff,
    };
  }
  /**
   * ==========================================
   * UPDATE STAFF
   * ==========================================
   */

  async updateStaff(staffId, data, file, adminUser, ipAddress) {
    const staff = await User.findOne({
      _id: staffId,
      role: "STAFF",
      isDeleted: false,
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    const name = data.name.trim();

    const email = data.email.toLowerCase().trim();

    /**
     * ==========================================
     * CHECK DUPLICATE EMAIL
     * ==========================================
     */

    const existingUser = await User.findOne({
      email,
      _id: {
        $ne: staffId,
      },
      isDeleted: false,
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const emailChanged = staff.email !== email;

    /**
     * ==========================================
     * UPDATE DETAILS
     * ==========================================
     */

    staff.name = name;
    staff.email = email;

    /**
     * ==========================================
     * UPDATE PROFILE IMAGE
     * ==========================================
     */

    if (file) {
      const uploadedImage = await replaceProfileImage(
        staff.profileImage?.publicId,
        file.buffer,
      );

      staff.profileImage = {
        publicId: uploadedImage.publicId,
        url: uploadedImage.url,
        uploadedAt: uploadedImage.uploadedAt || new Date(),
      };
    }

    /**
     * ==========================================
     * EMAIL CHANGED
     * ==========================================
     */

    if (emailChanged) {
      const newPassword = generatePassword();

      staff.password = await bcrypt.hash(newPassword, SALT_ROUNDS);

      try {
        await sendStaffCredentialsEmail(staff, newPassword);
      } catch (error) {
        console.error("Staff email failed:", error);
      }
    }

    await staff.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "UPDATE_STAFF",
      targetUser: staff._id,
      details: `Updated staff account (${staff.email})`,
      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,
      message: "Staff updated successfully.",
      staff,
    };
  }
  /**
   * ==========================================
   * GET DELETED STAFF
   * ==========================================
   */

  async getDeletedStaff() {
    const staff = await User.find({
      role: "STAFF",
      isDeleted: true,
    })
      .select("name email role profileImage deletedAt createdAt")
      .sort({
        deletedAt: -1,
      });

    return {
      success: true,
      count: staff.length,
      staff,
    };
  }
  /**
   * ==========================================
   * DELETE STAFF
   * ==========================================
   */

  async deleteStaff(staffId, adminUser, ipAddress) {
    const staff = await User.findOne({
      _id: staffId,
      role: "STAFF",
      isDeleted: false,
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    /**
     * ==========================================
     * SOFT DELETE
     * ==========================================
     */

    staff.isDeleted = true;
    staff.deletedAt = new Date();

    await staff.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "DELETE_STAFF",
      targetUser: staff._id,
      details: `Moved staff (${staff.email}) to Account Trash`,
      ipAddress,
    });

    return {
      success: true,
      message: "Staff moved to Account Trash successfully.",
    };
  }
  /**
   * ==========================================
   * RESTORE STAFF
   * ==========================================
   */

  async restoreStaff(staffId, adminUser, ipAddress) {
    const staff = await User.findOne({
      _id: staffId,
      role: "STAFF",
      isDeleted: true,
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    /**
     * ==========================================
     * RESTORE
     * ==========================================
     */

    staff.isDeleted = false;
    staff.deletedAt = null;

    await staff.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "RESTORE_STAFF",
      targetUser: staff._id,
      details: `Restored staff (${staff.email})`,
      ipAddress,
    });

    return {
      success: true,
      message: "Staff restored successfully.",
    };
  }
  /**
   * ==========================================
   * PERMANENT DELETE STAFF
   * ==========================================
   */

  async permanentlyDeleteStaff(staffId, adminUser, ipAddress) {
    const staff = await User.findById(staffId);

    if (!staff) {
      throw new Error("Staff not found.");
    }

    const email = staff.email;

    /**
     * ==========================================
     * DELETE PROFILE IMAGE
     * ==========================================
     */

    if (staff.profileImage?.publicId) {
      await deleteProfileImage(staff.profileImage.publicId);
    }

    /**
     * ==========================================
     * DELETE ACCOUNT
     * ==========================================
     */

    await User.findByIdAndDelete(staffId);

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "PERMANENT_DELETE_STAFF",
      details: `Permanently deleted staff (${email})`,
      ipAddress,
    });

    return {
      success: true,
      message: "Staff permanently deleted.",
    };
  }
  /**
   * ==========================================
   * GET ALL RESIDENTS
   * ==========================================
   */

  async getAllResidents() {
    const residents = await User.find({
      role: "RESIDENT",
      isDeleted: false,
    })
      .select(
        "name email role profileImage isVerified lastLoginAt lastLoginIP createdAt",
      )
      .sort({
        createdAt: -1,
      });

    return {
      success: true,
      count: residents.length,
      residents,
    };
  }
  /**
   * ==========================================
   * GET RESIDENT BY ID
   * ==========================================
   */

  async getResidentById(residentId) {
    const resident = await User.findOne({
      _id: residentId,
      role: "RESIDENT",
      isDeleted: false,
    });

    if (!resident) {
      throw new Error("Resident not found.");
    }

    return {
      success: true,
      resident,
    };
  }
  /**
   * ==========================================
   * UPDATE RESIDENT
   * ==========================================
   */

  async updateResident(residentId, data, file, adminUser, ipAddress) {
    const resident = await User.findOne({
      _id: residentId,
      role: "RESIDENT",
      isDeleted: false,
    });

    if (!resident) {
      throw new Error("Resident not found.");
    }

    const name = data.name.trim();

    const email = data.email.toLowerCase().trim();

    /**
     * ==========================================
     * CHECK DUPLICATE EMAIL
     * ==========================================
     */

    const existingUser = await User.findOne({
      email,
      _id: {
        $ne: residentId,
      },
      isDeleted: false,
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const emailChanged = resident.email !== email;

    /**
     * ==========================================
     * UPDATE DETAILS
     * ==========================================
     */

    resident.name = name;
    resident.email = email;

    /**
     * ==========================================
     * UPDATE PROFILE IMAGE
     * ==========================================
     */

    if (file) {
      const uploadedImage = await replaceProfileImage(
        resident.profileImage?.publicId,
        file.buffer,
      );

      resident.profileImage = {
        publicId: uploadedImage.publicId,
        url: uploadedImage.url,
        uploadedAt: uploadedImage.uploadedAt || new Date(),
      };
    }

    /**
     * ==========================================
     * EMAIL VERIFICATION
     * ==========================================
     */

    if (emailChanged) {
      resident.isVerified = false;

      resident.verificationToken = crypto.randomBytes(32).toString("hex");

      resident.verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );

      const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email/${resident.verificationToken}`;

      await sendVerificationEmail(resident, verificationUrl);
    }

    await resident.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "UPDATE_RESIDENT",
      targetUser: resident._id,
      details: `Updated resident account (${resident.email})`,
      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,
      message: "Resident updated successfully.",
      resident,
    };
  }
  /**
   * ==========================================
   * GET DELETED RESIDENTS
   * ==========================================
   */

  async getDeletedResidents() {
    const residents = await User.find({
      role: "RESIDENT",
      isDeleted: true,
    })
      .select("name email role profileImage deletedAt createdAt")
      .sort({
        deletedAt: -1,
      });

    return {
      success: true,
      count: residents.length,
      residents,
    };
  }
  /**
   * ==========================================
   * DELETE RESIDENT
   * ==========================================
   */

  async deleteResident(residentId, adminUser, ipAddress) {
    const resident = await User.findOne({
      _id: residentId,
      role: "RESIDENT",
      isDeleted: false,
    });

    if (!resident) {
      throw new Error("Resident not found.");
    }

    /**
     * ==========================================
     * SOFT DELETE
     * ==========================================
     */

    resident.isDeleted = true;
    resident.deletedAt = new Date();

    await resident.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "DELETE_RESIDENT",
      targetUser: resident._id,
      details: `Moved resident (${resident.email}) to Account Trash`,
      ipAddress,
    });

    return {
      success: true,
      message: "Resident moved to Account Trash successfully.",
    };
  }
  /**
   * ==========================================
   * DELETE RESIDENT
   * ==========================================
   */

  async deleteResident(residentId, adminUser, ipAddress) {
    const resident = await User.findOne({
      _id: residentId,
      role: "RESIDENT",
      isDeleted: false,
    });

    if (!resident) {
      throw new Error("Resident not found.");
    }

    /**
     * ==========================================
     * SOFT DELETE
     * ==========================================
     */

    resident.isDeleted = true;
    resident.deletedAt = new Date();

    await resident.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "DELETE_RESIDENT",
      targetUser: resident._id,
      details: `Moved resident (${resident.email}) to Account Trash`,
      ipAddress,
    });

    return {
      success: true,
      message: "Resident moved to Account Trash successfully.",
    };
  }
  /**
   * ==========================================
   * RESTORE RESIDENT
   * ==========================================
   */

  async restoreResident(residentId, adminUser, ipAddress) {
    const resident = await User.findOne({
      _id: residentId,
      role: "RESIDENT",
      isDeleted: true,
    });

    if (!resident) {
      throw new Error("Resident not found.");
    }

    /**
     * ==========================================
     * RESTORE
     * ==========================================
     */

    resident.isDeleted = false;
    resident.deletedAt = null;

    await resident.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "RESTORE_RESIDENT",
      targetUser: resident._id,
      details: `Restored resident (${resident.email})`,
      ipAddress,
    });

    return {
      success: true,
      message: "Resident restored successfully.",
    };
  }
  /**
   * ==========================================
   * PERMANENT DELETE RESIDENT
   * ==========================================
   */

  async permanentlyDeleteResident(residentId, adminUser, ipAddress) {
    const resident = await User.findById(residentId);

    if (!resident) {
      throw new Error("Resident not found.");
    }

    const email = resident.email;

    /**
     * ==========================================
     * DELETE PROFILE IMAGE
     * ==========================================
     */

    if (resident.profileImage?.publicId) {
      await deleteProfileImage(resident.profileImage.publicId);
    }

    /**
     * ==========================================
     * DELETE ACCOUNT
     * ==========================================
     */

    await User.findByIdAndDelete(residentId);

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "PERMANENT_DELETE_RESIDENT",
      details: `Permanently deleted resident (${email})`,
      ipAddress,
    });

    return {
      success: true,
      message: "Resident permanently deleted.",
    };
  }
  /**
   * ==========================================
   * GET ADMIN PROFILE
   * ==========================================
   */

  async getProfile(adminId) {
    const admin = await User.findOne({
      _id: adminId,
      role: "ADMIN",
      isDeleted: false,
    }).select("name email role profileImage description createdAt");

    if (!admin) {
      throw new Error("Administrator not found.");
    }

    return {
      success: true,
      admin,
    };
  }
  /**
   * ==========================================
   * UPDATE ADMIN PROFILE
   * ==========================================
   */

  async updateProfile(adminId, data, file, adminUser, ipAddress) {
    const admin = await User.findOne({
      _id: adminId,
      role: "ADMIN",
      isDeleted: false,
    });

    if (!admin) {
      throw new Error("Administrator not found.");
    }

    /**
     * ==========================================
     * UPDATE BIOGRAPHY
     * ==========================================
     */

    admin.description = (data.description || "").trim();

    /**
     * ==========================================
     * UPDATE PROFILE IMAGE
     * ==========================================
     */

    if (file) {
      const uploadedImage = await replaceProfileImage(
        admin.profileImage?.publicId,
        file.buffer,
      );

      admin.profileImage = {
        publicId: uploadedImage.publicId,
        url: uploadedImage.url,
        uploadedAt: uploadedImage.uploadedAt || new Date(),
      };
    }

    await admin.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,
      role: adminUser.role,
      action: "UPDATE_PROFILE",
      targetUser: admin._id,
      details: "Updated administrator profile.",
      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,
      message: "Profile updated successfully.",
      admin,
    };
  }

  /**
   * ==========================================
   * COMPLAINT MANAGEMENT
   * ==========================================
   */

  /**
   * ==========================================
   * GET AVAILABLE STAFF
   * ==========================================
   */

  async getStaffList() {
    const staff = await User.find({
      role: "STAFF",

      isDeleted: false,
    })
      .select("name email profileImage")
      .sort({
        name: 1,
      });

    return {
      success: true,

      staff,
    };
  }

  /**
   * ==========================================
   * APPROVE COMPLAINT
   * ==========================================
   */

  async approveComplaint(complaintId, data, adminUser, ipAddress) {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    /**
     * ==========================================
     * VALID STATUS
     * ==========================================
     */

    if (
      complaint.status !== "SUBMITTED" &&
      complaint.status !== "RESUBMITTED"
    ) {
      throw new Error("This complaint has already been reviewed.");
    }

    /**
     * ==========================================
     * VALIDATE STAFF
     * ==========================================
     */

    const staff = await User.findOne({
      _id: data.assignedStaff,

      role: "STAFF",

      isDeleted: false,
    });

    if (!staff) {
      throw new Error("Selected staff member does not exist.");
    }

    /**
     * ==========================================
     * VALIDATE PRICE
     * ==========================================
     */

    const estimatedPrice = Number(data.estimatedPrice);

    if (Number.isNaN(estimatedPrice) || estimatedPrice < 0) {
      throw new Error("Estimated price is invalid.");
    }

    /**
     * ==========================================
     * VALIDATE DEADLINE
     * ==========================================
     */

    if (!data.deadlineDate || !data.deadlineTime) {
      throw new Error("Deadline is required.");
    }

    /**
     * ==========================================
     * CREATE DEADLINE
     * ==========================================
     */

    const deadlineAt = new Date(`${data.deadlineDate}T${data.deadlineTime}:00`);

    /**
     * ==========================================
     * APPROVE COMPLAINT
     * ==========================================
     */

    complaint.status = "APPROVED";

    complaint.assignedStaff = staff._id;

    complaint.assignedBy = adminUser._id;

    complaint.estimatedPrice = estimatedPrice;

    complaint.deadlineAt = deadlineAt;

    complaint.adminRemark = "Complaint approved and assigned.";

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "APPROVED",

      performedBy: adminUser._id,

      description: `Complaint approved and assigned to ${staff.name}.`,
    });

    /**
     * ==========================================
     * SAVE
     * ==========================================
     */

    await complaint.save();

    /**
     * ==========================================
     * AUDIT LOG
     * ==========================================
     */

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "APPROVE_COMPLAINT",

      targetUser: complaint.resident,

      details: `Approved complaint ${complaint.complaintNumber} and assigned it to ${staff.name}.`,

      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

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

  async rejectComplaint(complaintId, data, adminUser, ipAddress) {
    /**
     * ==========================================
     * FIND COMPLAINT
     * ==========================================
     */

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    /**
     * ==========================================
     * VALIDATE STATUS
     * ==========================================
     */

    if (
      complaint.status !== "SUBMITTED" &&
      complaint.status !== "RESUBMITTED"
    ) {
      throw new Error("This complaint has already been reviewed.");
    }

    /**
     * ==========================================
     * VALIDATE REMARK
     * ==========================================
     */

    const remark = (data.reason || "").trim();

    if (remark.length < 10) {
      throw new Error("Please provide a proper rejection reason.");
    }

    /**
     * ==========================================
     * UPDATE COMPLAINT
     * ==========================================
     */

    complaint.status = "REJECTED";

    complaint.adminRemark = remark;

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "REJECTED",

      performedBy: adminUser._id,

      description: remark,
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

      action: "REJECT_COMPLAINT",

      targetUser: complaint.resident,

      details: `Rejected complaint ${complaint.complaintNumber}.`,

      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,

      message: "Complaint rejected successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * APPROVE COMPLETED COMPLAINT
   * ==========================================
   */

  async approveCompletedComplaint(adminUser, complaintId, ipAddress) {
    /**
     * ==========================================
     * FIND COMPLAINT
     * ==========================================
     */

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    /**
     * ==========================================
     * VALID STATUS
     * ==========================================
     */

    if (complaint.status !== "PENDING_REVIEW") {
      throw new Error("This complaint is not awaiting review.");
    }

    /**
     * ==========================================
     * COMPLETE
     * ==========================================
     */

    complaint.status = "COMPLETED";

    complaint.closedBy = adminUser._id;

    complaint.adminRemark = "Maintenance work approved by administrator.";

    complaint.completedAt = new Date();

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "WORK_APPROVED",

      performedBy: adminUser._id,

      description: "Administrator approved maintenance completion.",
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

      action: "APPROVE_COMPLETED_COMPLAINT",

      targetUser: complaint.resident,

      details: `Approved completed complaint ${complaint.complaintNumber}.`,

      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,

      message: "Maintenance work approved successfully.",

      complaint,
    };
  }

  /**
   * ==========================================
   * REJECT COMPLETED COMPLAINT
   * ==========================================
   */

  async rejectCompletedComplaint(adminUser, complaintId, data, ipAddress) {
    /**
     * ==========================================
     * FIND COMPLAINT
     * ==========================================
     */

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    /**
     * ==========================================
     * VALID STATUS
     * ==========================================
     */

    if (complaint.status !== "PENDING_REVIEW") {
      throw new Error("This complaint is not awaiting review.");
    }

    /**
     * ==========================================
     * VALIDATE REMARK
     * ==========================================
     */

    const remark = (data.reason || "").trim();

    if (remark.length < 10) {
      throw new Error("Please provide a proper rejection reason.");
    }

    /**
     * ==========================================
     * SEND BACK TO STAFF
     * ==========================================
     */

    complaint.status = "COMPLETION_REJECTED";

    complaint.adminRemark = remark;

    complaint.completedAt = null;

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "WORK_REJECTED",

      performedBy: adminUser._id,

      description: `Completion rejected. Reason: ${remark}`,
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

      action: "REJECT_COMPLETED_COMPLAINT",

      targetUser: complaint.resident,

      details: `Rejected completed complaint ${complaint.complaintNumber}.`,

      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,

      message: "Completion proof rejected and returned to the assigned staff.",

      complaint,
    };
  }

  /**
   * ==========================================
   * APPROVE CANNOT COMPLETE
   * ==========================================
   */

  async approveCannotCompleteComplaint(
    adminUser,
    complaintId,
    data,
    ipAddress,
  ) {
    /**
     * ==========================================
     * FIND COMPLAINT
     * ==========================================
     */

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    /**
     * ==========================================
     * VALID STATUS
     * ==========================================
     */

    if (complaint.status !== "CANNOT_COMPLETE") {
      throw new Error("Complaint is not awaiting administrator review.");
    }

    /**
     * ==========================================
     * VALIDATE STAFF
     * ==========================================
     */

    const staff = await User.findOne({
      _id: data.assignedStaff,
      role: "STAFF",
      isDeleted: false,
    });

    if (!staff) {
      throw new Error("Selected staff member not found.");
    }

    /**
     * ==========================================
     * VALIDATE DEADLINE
     * ==========================================
     */

    if (!data.deadlineDate || !data.deadlineTime) {
      throw new Error("Please select a deadline.");
    }

    const deadline = new Date(`${data.deadlineDate}T${data.deadlineTime}:00`);

    /**
     * ==========================================
     * REASSIGN
     * ==========================================
     */

    complaint.status = "APPROVED";

    complaint.assignedStaff = staff._id;

    complaint.assignedBy = adminUser._id;

    complaint.deadlineAt = deadline;

    complaint.adminRemark =
      "Complaint reassigned after staff reported inability to complete.";

    complaint.cannotCompleteRemark = "";

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "REASSIGNED",

      performedBy: adminUser._id,

      description: `Complaint reassigned to ${staff.name}.`,
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

      targetUser: complaint.resident,

      details: `Complaint ${complaint.complaintNumber} reassigned to ${staff.name}.`,

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
   * REJECT CANNOT COMPLETE
   * ==========================================
   */

  async rejectCannotCompleteComplaint(adminUser, complaintId, data, ipAddress) {
    /**
     * ==========================================
     * FIND COMPLAINT
     * ==========================================
     */

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      throw new Error("Complaint not found.");
    }

    /**
     * ==========================================
     * VALID STATUS
     * ==========================================
     */

    if (complaint.status !== "CANNOT_COMPLETE") {
      throw new Error("Complaint is not awaiting administrator review.");
    }

    /**
     * ==========================================
     * VALIDATE REMARK
     * ==========================================
     */

    const remark = (data.reason || "").trim();

    if (remark.length < 10) {
      throw new Error("Please provide a proper rejection reason.");
    }

    /**
     * ==========================================
     * RETURN TO SAME STAFF
     * ==========================================
     */

    complaint.status = "APPROVED";

    complaint.adminRemark = remark;

    complaint.cannotCompleteRemark = "";

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    complaint.timeline.push({
      action: "CANNOT_COMPLETE_REJECTED",

      performedBy: adminUser._id,

      description: `Administrator rejected the staff report. Reason: ${remark}`,
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

      action: "REJECT_CANNOT_COMPLETE",

      targetUser: complaint.resident,

      details: `Rejected 'Unable to Complete' report for complaint ${complaint.complaintNumber}.`,

      ipAddress,
    });

    /**
     * ==========================================
     * RESPONSE
     * ==========================================
     */

    return {
      success: true,

      message: "Complaint has been returned to the assigned staff.",

      complaint,
    };
  }
}

module.exports = new AdminService();
