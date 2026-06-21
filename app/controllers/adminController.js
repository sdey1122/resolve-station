/**
 * ==========================================
 * Admin Controller
 * ==========================================
 */

const adminService = require("../services/adminService");

const { createStaffValidation } = require("../validations/adminValidation");

const auditLogService = require("../services/auditLogService");

class AdminController {
  /**
   * ==========================================
   * CREATE STAFF
   * ==========================================
   */

  async createStaff(req, res) {
    try {
      const { error } = createStaffValidation.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const result = await adminService.createStaff(
        req.body,
        req.file,
        req.user,
        req.ip,
      );

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * GET ALL STAFF
   * ==========================================
   */

  async getAllStaff(req, res) {
    try {
      const result = await adminService.getAllStaff();

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
   * GET DELETED STAFF
   * ==========================================
   */

  async getDeletedStaff(req, res) {
    try {
      const result = await adminService.getDeletedStaff();

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
   * SOFT DELETE STAFF
   * ==========================================
   */

  async deleteStaff(req, res) {
    try {
      const result = await adminService.deleteStaff(
        req.params.id,
        req.user,
        req.ip,
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
   * RESTORE STAFF
   * ==========================================
   */

  async restoreStaff(req, res) {
    try {
      const result = await adminService.restoreStaff(
        req.params.id,
        req.user,
        req.ip,
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
   * PERMANENT DELETE STAFF
   * ==========================================
   */

  async permanentlyDeleteStaff(req, res) {
    try {
      const result = await adminService.permanentlyDeleteStaff(
        req.params.id,
        req.user,
        req.ip,
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
   * GET AUDIT LOGS
   * ==========================================
   */

  async getAuditLogs(req, res) {
    try {
      const result = await auditLogService.getLogs();

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AdminController();
