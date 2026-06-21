/**
 * ==========================================
 * Profile Controller
 * ==========================================
 */

const profileService = require("../services/profileService");
const {
  changePasswordValidation,
} = require("../validations/profileValidation");

class ProfileController {
  /**
   * ==========================================
   * GET MY PROFILE
   * ==========================================
   */

  async getMyProfile(req, res) {
    try {
      const result = await profileService.getMyProfile(req.user._id);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * UPDATE PROFILE IMAGE
   * ==========================================
   */

  async updateProfileImage(req, res) {
    try {
      const result = await profileService.updateProfileImage(
        req.user._id,
        req.file,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * DELETE PROFILE IMAGE
   * ==========================================
   */

  async deleteProfileImage(req, res) {
    try {
      const result = await profileService.deleteProfileImage(req.user._id);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * CHANGE PASSWORD
   * ==========================================
   */

  async changePassword(req, res) {
    try {
      const { error } = changePasswordValidation.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const result = await profileService.changePassword(
        req.user._id,
        req.body.currentPassword,
        req.body.newPassword,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProfileController();
