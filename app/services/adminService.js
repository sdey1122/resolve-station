/**
 * ==========================================
 * Admin Service
 * ==========================================
 */

const bcrypt = require("bcryptjs");

const User = require("../models/User");

const { uploadProfileImage } = require("./cloudinaryService");

const auditLogService = require("./auditLogService");

const generatePassword = require("../utils/generatePassword");

const { sendStaffCredentialsEmail } = require("./emailService");

const SALT_ROUNDS = 12;

class AdminService {
  /**
   * ==========================================
   * CREATE STAFF
   * ==========================================
   */

  async createStaff(data, file, adminUser, ipAddress) {
    const { name, email } = data;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
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
      publicId: null,

      url: process.env.DEFAULT_AVATAR_URL,

      uploadedAt: null,
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
     * GENERATE PASSWORD
     * ==========================================
     */

    const tempPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(tempPassword, SALT_ROUNDS);

    /**
     * ==========================================
     * CREATE STAFF
     * ==========================================
     */

    const staff = await User.create({
      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      role: "STAFF",

      profileImage,

      isVerified: true,
    });

    /**
     * ==========================================
     * SEND STAFF EMAIL
     * ==========================================
     */

    await sendStaffCredentialsEmail(staff, tempPassword);

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

      details: `Created staff account for ${staff.email}`,

      ipAddress,
    });

    return {
      success: true,

      message: "Staff account created successfully.",

      staff: {
        id: staff._id,

        name: staff.name,

        email: staff.email,

        role: staff.role,

        profileImage: staff.profileImage?.url,
      },
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
   * GET DELETED STAFF
   * ==========================================
   */

  async getDeletedStaff() {
    const staff = await User.find({
      role: "STAFF",
      isDeleted: true,
    })
      .select("name email role profileImage isVerified deletedAt createdAt")
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
   * SOFT DELETE STAFF
   * ==========================================
   */

  async deleteStaff(staffId, adminUser, ipAddress) {
    const staff = await User.findOne({
      _id: staffId,
      role: "STAFF",
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    if (staff.isDeleted) {
      throw new Error("Staff member already deleted.");
    }

    staff.isDeleted = true;

    staff.deletedAt = new Date();

    await staff.save();

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "DELETE_STAFF",

      targetUser: staff._id,

      details: `Soft deleted ${staff.email}`,

      ipAddress,
    });

    return {
      success: true,

      message: "Staff member deleted successfully.",
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
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    if (!staff.isDeleted) {
      throw new Error("Staff member is already active.");
    }

    staff.isDeleted = false;

    staff.deletedAt = null;

    await staff.save();

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "RESTORE_STAFF",

      targetUser: staff._id,

      details: `Restored ${staff.email}`,

      ipAddress,
    });

    return {
      success: true,

      message: "Staff member restored successfully.",
    };
  }

  /**
   * ==========================================
   * PERMANENT DELETE STAFF
   * ==========================================
   */

  async permanentlyDeleteStaff(staffId, adminUser, ipAddress) {
    const staff = await User.findOne({
      _id: staffId,
      role: "STAFF",
    });

    if (!staff) {
      throw new Error("Staff member not found.");
    }

    const staffEmail = staff.email;

    await User.findByIdAndDelete(staffId);

    await auditLogService.createLog({
      performedBy: adminUser._id,

      role: adminUser.role,

      action: "PERMANENT_DELETE_STAFF",

      details: `Permanently deleted ${staffEmail}`,

      ipAddress,
    });

    return {
      success: true,

      message: "Staff member permanently deleted.",
    };
  }
}

module.exports = new AdminService();
