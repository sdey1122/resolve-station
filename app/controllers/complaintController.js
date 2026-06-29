/**
 * ==========================================
 * COMPLAINT CONTROLLER
 * ==========================================
 */

const complaintService = require("../services/complaintService");

/**
 * ==========================================
 * HELPERS
 * ==========================================
 */

const normalizeIp = (ip) => {
  if (!ip) return "Unknown";

  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  if (ip === "::1") {
    return "127.0.0.1";
  }

  return ip;
};

class ComplaintController {
  /**
   * ==========================================
   * CREATE COMPLAINT
   * ==========================================
   */

  async createComplaint(req, res) {
    try {
      const result = await complaintService.createComplaint(
        req.body,
        req.file,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(201).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * GET RESIDENT COMPLAINTS
   * ==========================================
   */

  async getResidentComplaints(req, res) {
    try {
      const result = await complaintService.getResidentComplaints(req.user._id);

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * GET COMPLAINT BY ID
   * ==========================================
   */

  async getComplaintById(req, res) {
    try {
      const result = await complaintService.getComplaintById(
        req.params.id,
        req.user._id,
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * UPDATE COMPLAINT
   * ==========================================
   */

  async updateComplaint(req, res) {
    try {
      const result = await complaintService.updateComplaint(
        req.params.id,
        req.body,
        req.file,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * GET DELETED COMPLAINTS
   * ==========================================
   */

  async getDeletedComplaints(req, res) {
    try {
      const result = await complaintService.getDeletedComplaints(req.user._id);

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * DELETE COMPLAINT
   * ==========================================
   */

  async deleteComplaint(req, res) {
    try {
      const result = await complaintService.deleteComplaint(
        req.params.id,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * RESTORE COMPLAINT
   * ==========================================
   */

  async restoreComplaint(req, res) {
    try {
      const result = await complaintService.restoreComplaint(
        req.params.id,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * PERMANENT DELETE COMPLAINT
   * ==========================================
   */

  async permanentlyDeleteComplaint(req, res) {
    try {
      const result = await complaintService.permanentlyDeleteComplaint(
        req.params.id,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * GET ALL COMPLAINTS
   * ==========================================
   */

  async getAllComplaints(req, res) {
    try {
      const result = await complaintService.getAllComplaints();

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * GET COMPLAINT DETAILS
   * ==========================================
   */

  async getComplaintDetails(req, res) {
    try {
      const result = await complaintService.getComplaintDetails(req.params.id);

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(404).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * APPROVE COMPLAINT
   * ==========================================
   */

  async approveComplaint(req, res) {
    try {
      const result = await complaintService.approveComplaint(
        req.params.id,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * REJECT COMPLAINT
   * ==========================================
   */

  async rejectComplaint(req, res) {
    try {
      const result = await complaintService.rejectComplaint(
        req.params.id,
        req.body.remark,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * ASSIGN STAFF
   * ==========================================
   */

  async assignStaff(req, res) {
    try {
      const result = await complaintService.assignStaff(
        req.params.id,
        req.body,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * REASSIGN COMPLAINT
   * ==========================================
   */

  async reassignComplaint(req, res) {
    try {
      const result = await complaintService.reassignComplaint(
        req.params.id,
        req.body,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * CLOSE COMPLAINT
   * ==========================================
   */

  async closeComplaint(req, res) {
    try {
      const result = await complaintService.closeComplaint(
        req.params.id,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * START WORK
   * ==========================================
   */

  async startWork(req, res) {
    try {
      const result = await complaintService.startWork(
        req.params.id,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * COMPLETE WORK
   * ==========================================
   */

  async completeWork(req, res) {
    try {
      const result = await complaintService.completeWork(
        req.params.id,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * CANNOT COMPLETE WORK
   * ==========================================
   */

  async cannotCompleteWork(req, res) {
    try {
      const result = await complaintService.cannotCompleteWork(
        req.params.id,
        req.body.remark,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  }
}

module.exports = new ComplaintController();
