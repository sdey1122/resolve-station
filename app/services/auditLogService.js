/**
 * ==========================================
 * Audit Log Service
 * ==========================================
 */

const AuditLog = require("../models/AuditLog");

class AuditLogService {
  /**
   * ==========================================
   * CREATE LOG
   * ==========================================
   */

  async createLog({
    performedBy,
    role,
    action,
    targetUser = null,
    details = null,
    ipAddress = null,
  }) {
    await AuditLog.create({
      performedBy,

      role,

      action,

      targetUser,

      details,

      ipAddress,
    });
  }

  /**
   * ==========================================
   * GET ALL LOGS
   * ==========================================
   */

  async getLogs() {
    const logs = await AuditLog.find()
      .populate("performedBy", "name email role")
      .populate("targetUser", "name email role")
      .sort({
        createdAt: -1,
      });

    return {
      success: true,

      count: logs.length,

      logs,
    };
  }
}

module.exports = new AuditLogService();
