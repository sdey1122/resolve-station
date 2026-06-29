// /**
//  * ==========================================
//  * ADMIN CONTROLLER
//  * ==========================================
//  */

// const adminService = require("../services/adminService");

// const auditLogService = require("../services/auditLogService");

// const { createStaffValidation } = require("../validations/adminValidation");

// class AdminController {
//   /**
//    * ==========================================
//    * CREATE STAFF
//    * ==========================================
//    */

//   async createStaff(req, res) {
//     try {
//       const { error } = createStaffValidation.validate(req.body);

//       if (error) {
//         return res.status(400).json({
//           success: false,
//           message: error.details[0].message,
//         });
//       }

//       const result = await adminService.createStaff(
//         req.body,
//         req.file,
//         req.user,
//         req.ip,
//       );

//       return res.status(201).json(result);
//     } catch (error) {
//       if (error.message === "An account with this email already exists.") {
//         return res.status(409).json({
//           success: false,
//           field: "email",
//           message: error.message,
//         });
//       }

//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * GET ALL STAFF
//    * ==========================================
//    */

//   async getAllStaff(req, res) {
//     try {
//       const result = await adminService.getAllStaff();

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * GET STAFF BY ID
//    * ==========================================
//    */

//   async getStaffById(req, res) {
//     try {
//       const result = await adminService.getStaffById(req.params.id);

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * UPDATE STAFF
//    * ==========================================
//    */

//   async updateStaff(req, res) {
//     try {
//       const result = await adminService.updateStaff(
//         req.params.id,
//         req.body,
//         req.file,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       if (error.message === "An account with this email already exists.") {
//         return res.status(409).json({
//           success: false,
//           field: "email",
//           message: error.message,
//         });
//       }

//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
//   /**
//    * ==========================================
//    * GET DELETED STAFF
//    * ==========================================
//    */

//   async getDeletedStaff(req, res) {
//     try {
//       const result = await adminService.getDeletedStaff();

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * SOFT DELETE STAFF
//    * ==========================================
//    */

//   async deleteStaff(req, res) {
//     try {
//       const result = await adminService.deleteStaff(
//         req.params.id,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * RESTORE STAFF
//    * ==========================================
//    */

//   async restoreStaff(req, res) {
//     try {
//       const result = await adminService.restoreStaff(
//         req.params.id,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * PERMANENT DELETE STAFF
//    * ==========================================
//    */

//   async permanentlyDeleteStaff(req, res) {
//     try {
//       const result = await adminService.permanentlyDeleteStaff(
//         req.params.id,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * GET ALL RESIDENTS
//    * ==========================================
//    */

//   async getAllResidents(req, res) {
//     try {
//       const result = await adminService.getAllResidents();

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * GET RESIDENT BY ID
//    * ==========================================
//    */

//   async getResidentById(req, res) {
//     try {
//       const result = await adminService.getResidentById(req.params.id);

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * UPDATE RESIDENT
//    * ==========================================
//    */

//   async updateResident(req, res) {
//     try {
//       const result = await adminService.updateResident(
//         req.params.id,
//         req.body,
//         req.file,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       if (error.message === "An account with this email already exists.") {
//         return res.status(409).json({
//           success: false,
//           field: "email",
//           message: error.message,
//         });
//       }

//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
//   /**
//    * ==========================================
//    * GET DELETED RESIDENTS
//    * ==========================================
//    */

//   async getDeletedResidents(req, res) {
//     try {
//       const result = await adminService.getDeletedResidents();

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * SOFT DELETE RESIDENT
//    * ==========================================
//    */

//   async deleteResident(req, res) {
//     try {
//       const result = await adminService.deleteResident(
//         req.params.id,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * RESTORE RESIDENT
//    * ==========================================
//    */

//   async restoreResident(req, res) {
//     try {
//       const result = await adminService.restoreResident(
//         req.params.id,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * PERMANENT DELETE RESIDENT
//    * ==========================================
//    */

//   async permanentlyDeleteResident(req, res) {
//     try {
//       const result = await adminService.permanentlyDeleteResident(
//         req.params.id,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * LOCK / UNLOCK RESIDENT
//    * ==========================================
//    */

//   async residentAccountLock(req, res) {
//     return res.status(501).json({
//       success: false,
//       message: "Resident account lock is not implemented yet.",
//     });
//   }

//   /**
//    * ==========================================
//    * GET ADMIN PROFILE
//    * ==========================================
//    */

//   async getProfile(req, res) {
//     try {
//       const result = await adminService.getProfile(req.user._id);

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * UPDATE ADMIN PROFILE
//    * ==========================================
//    */

//   async updateProfile(req, res) {
//     try {
//       const result = await adminService.updateProfile(
//         req.user._id,
//         req.body,
//         req.file,
//         req.user,
//         req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * GET ADMIN PROFILE
//    * ==========================================
//    */

//   async getProfile(req, res) {
//     try {
//       const result = await adminService.getProfile(req.user._id);

//       return res.status(200).json(result);
//     } catch (error) {
//       console.error(error);

//       return res.status(500).json({
//         success: false,

//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * UPDATE ADMIN PROFILE
//    * ==========================================
//    */

//   async updateProfile(req, res) {
//     try {
//       const result = await adminService.updateProfile(
//         req.user._id,
//         req.body,
//         req.file,
//         req.user,
//         req.ip.startsWith("::ffff:")
//           ? req.ip.replace("::ffff:", "")
//           : req.ip === "::1"
//             ? "127.0.0.1"
//             : req.ip,
//       );

//       return res.status(200).json(result);
//     } catch (error) {
//       console.error(error);

//       return res.status(500).json({
//         success: false,

//         message: error.message,
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * PROFILE
//    * ==========================================
//    */

//   profile(req, res) {
//     return res.render("admin/profile", {
//       user: req.user,
//     });
//   }

//   /**
//    * ==========================================
//    * GET AUDIT LOGS
//    * ==========================================
//    */

//   async getAuditLogs(req, res) {
//     try {
//       const result = await auditLogService.getLogs();

//       return res.status(200).json(result);
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// }

// module.exports = new AdminController();

/**
 * ==========================================
 * ADMIN CONTROLLER
 * ==========================================
 */

const adminService = require("../services/adminService");
const auditLogService = require("../services/auditLogService");

const { createStaffValidation } = require("../validations/adminValidation");

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
        normalizeIp(req.ip),
      );

      return res.status(201).json(result);
    } catch (error) {
      if (error.message === "An account with this email already exists.") {
        return res.status(409).json({
          success: false,
          field: "email",
          message: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
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
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * GET STAFF BY ID
   * ==========================================
   */

  async getStaffById(req, res) {
    try {
      const result = await adminService.getStaffById(req.params.id);

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
   * UPDATE STAFF
   * ==========================================
   */

  async updateStaff(req, res) {
    try {
      const result = await adminService.updateStaff(
        req.params.id,
        req.body,
        req.file,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === "An account with this email already exists.") {
        return res.status(409).json({
          success: false,
          field: "email",
          message: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
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
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * DELETE STAFF
   * ==========================================
   */

  async deleteStaff(req, res) {
    try {
      const result = await adminService.deleteStaff(
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
   * RESTORE STAFF
   * ==========================================
   */

  async restoreStaff(req, res) {
    try {
      const result = await adminService.restoreStaff(
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
   * PERMANENT DELETE STAFF
   * ==========================================
   */

  async permanentlyDeleteStaff(req, res) {
    try {
      const result = await adminService.permanentlyDeleteStaff(
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
   * GET ALL RESIDENTS
   * ==========================================
   */

  async getAllResidents(req, res) {
    try {
      const result = await adminService.getAllResidents();

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
   * GET RESIDENT BY ID
   * ==========================================
   */

  async getResidentById(req, res) {
    try {
      const result = await adminService.getResidentById(req.params.id);

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
   * UPDATE RESIDENT
   * ==========================================
   */

  async updateResident(req, res) {
    try {
      const result = await adminService.updateResident(
        req.params.id,
        req.body,
        req.file,
        req.user,
        normalizeIp(req.ip),
      );

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === "An account with this email already exists.") {
        return res.status(409).json({
          success: false,
          field: "email",
          message: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * ==========================================
   * GET DELETED RESIDENTS
   * ==========================================
   */

  async getDeletedResidents(req, res) {
    try {
      const result = await adminService.getDeletedResidents();

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
   * DELETE RESIDENT
   * ==========================================
   */

  async deleteResident(req, res) {
    try {
      const result = await adminService.deleteResident(
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
   * RESTORE RESIDENT
   * ==========================================
   */

  async restoreResident(req, res) {
    try {
      const result = await adminService.restoreResident(
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
   * PERMANENT DELETE RESIDENT
   * ==========================================
   */

  async permanentlyDeleteResident(req, res) {
    try {
      const result = await adminService.permanentlyDeleteResident(
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
   * LOCK / UNLOCK RESIDENT
   * ==========================================
   */

  async residentAccountLock(req, res) {
    return res.status(501).json({
      success: false,
      message: "Resident account lock is not implemented yet.",
    });
  }

  /**
   * ==========================================
   * GET ADMIN PROFILE
   * ==========================================
   */

  async getProfile(req, res) {
    try {
      const result = await adminService.getProfile(req.user._id);

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
   * UPDATE ADMIN PROFILE
   * ==========================================
   */

  async updateProfile(req, res) {
    try {
      const result = await adminService.updateProfile(
        req.user._id,
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
   * PROFILE PAGE
   * ==========================================
   */

  profile(req, res) {
    return res.render("admin/profile", {
      user: req.user,
    });
  }

  /**
   * ==========================================
   * COMPLAINT MANAGEMENT
   * ==========================================
   */

  /**
   * Get Available Staff
   */

  async getStaffList(req, res) {
    try {
      const result = await adminService.getStaffList();

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
   * Approve Complaint
   */

  async approveComplaint(req, res) {
    try {
      const result = await adminService.approveComplaint(
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
   * Reject Complaint
   */

  async rejectComplaint(req, res) {
    try {
      const result = await adminService.rejectComplaint(
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
   * APPROVE COMPLETED COMPLAINT
   * ==========================================
   */

  async approveCompletedComplaint(req, res) {
    try {
      const result = await adminService.approveCompletedComplaint(
        req.user,
        req.params.id,
        normalizeIp(req.ip),
      );

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
  }

  /**
   * ==========================================
   * REJECT COMPLETED COMPLAINT
   * ==========================================
   */

  async rejectCompletedComplaint(req, res) {
    try {
      const result = await adminService.rejectCompletedComplaint(
        req.user,
        req.params.id,
        req.body,
        normalizeIp(req.ip),
      );

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
  }

  /**
   * ==========================================
   * APPROVE CANNOT COMPLETE
   * ==========================================
   */

  async approveCannotCompleteComplaint(req, res) {
    try {
      const result = await adminService.approveCannotCompleteComplaint(
        req.user,
        req.params.id,
        req.body,
        normalizeIp(req.ip),
      );

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: "Internal Server Error.",
      });
    }
  }

  /**
   * ==========================================
   * REJECT CANNOT COMPLETE
   * ==========================================
   */

  async rejectCannotCompleteComplaint(req, res) {
    try {
      const result = await adminService.rejectCannotCompleteComplaint(
        req.user,
        req.params.id,
        req.body,
        normalizeIp(req.ip),
      );

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: "Internal Server Error.",
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
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AdminController();
