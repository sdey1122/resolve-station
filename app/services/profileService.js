/**
 * ==========================================
 * Profile Service
 * ==========================================
 */

const bcrypt = require("bcryptjs");

const User = require("../models/User");

const {
  replaceProfileImage,
  restoreDefaultAvatar,
} = require("./cloudinaryService");

const auditLogService = require("./auditLogService");

const SALT_ROUNDS = 12;

class ProfileService {
  /**
   * ==========================================
   * GET MY PROFILE
   * ==========================================
   */

  async getMyProfile(userId) {
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new Error("User not found.");
    }

    return {
      success: true,

      user,
    };
  }

  /**
   * ==========================================
   * UPDATE PROFILE IMAGE
   * ==========================================
   */

  async updateProfileImage(userId, file) {
    if (!file) {
      throw new Error("Profile image is required.");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const profileImage = await replaceProfileImage(
      user.profileImage?.publicId,
      file.buffer,
    );

    user.profileImage = profileImage;

    await user.save();

    await auditLogService.createLog({
      performedBy: user._id,

      role: user.role,

      action: "PROFILE_IMAGE_UPDATED",

      details: "Profile image updated successfully.",
    });

    return {
      success: true,

      message: "Profile image updated successfully.",

      profileImage: user.profileImage,
    };
  }

  /**
   * ==========================================
   * DELETE PROFILE IMAGE
   * ==========================================
   */

  async deleteProfileImage(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    user.profileImage = await restoreDefaultAvatar(user.profileImage?.publicId);

    await user.save();

    await auditLogService.createLog({
      performedBy: user._id,

      role: user.role,

      action: "PROFILE_IMAGE_DELETED",

      details: "Profile image removed successfully.",
    });

    return {
      success: true,

      message: "Profile image removed successfully.",

      profileImage: user.profileImage,
    };
  }

  /**
   * ==========================================
   * CHANGE PASSWORD
   * ==========================================
   */

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    user.password = hashedPassword;

    /**
     * FORCE RE-LOGIN
     */

    user.refreshToken = null;

    await user.save();

    await auditLogService.createLog({
      performedBy: user._id,

      role: user.role,

      action: "CHANGE_PASSWORD",

      details: "Password changed successfully.",
    });

    return {
      success: true,

      message: "Password changed successfully. Please login again.",
    };
  }
}

module.exports = new ProfileService();
