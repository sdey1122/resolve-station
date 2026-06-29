// /**
//  * ==========================================
//  * Staff Controller
//  * ==========================================
//  */

// const staffService = require("../services/staffService");

// class StaffController {
//   /**
//    * ==========================================
//    * DASHBOARD
//    * ==========================================
//    */

//   async dashboard(req, res) {
//     try {
//       const result = await staffService.dashboard(req.user);

//       return res.status(200).json(result);
//     } catch (error) {
//       console.error(error);

//       return res.status(500).json({
//         success: false,
//         message: "Failed to load dashboard.",
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * COMPLETE JOB
//    * ==========================================
//    */

//   async completeComplaint(req, res) {
//     try {
//       const result = await staffService.completeComplaint(
//         req.user,
//         req.params.id,
//         req.file,
//       );

//       return res.status(result.success ? 200 : 400).json(result);
//     } catch (error) {
//       console.error(error);

//       return res.status(500).json({
//         success: false,
//         message: "Failed to complete complaint.",
//       });
//     }
//   }

//   /**
//    * ==========================================
//    * CANNOT COMPLETE
//    * ==========================================
//    */

//   async cannotCompleteComplaint(req, res) {
//     try {
//       const result = await staffService.cannotCompleteComplaint(
//         req.user,
//         req.params.id,
//         req.body,
//       );

//       return res.status(result.success ? 200 : 400).json(result);
//     } catch (error) {
//       console.error(error);

//       return res.status(500).json({
//         success: false,
//         message: "Failed to submit report.",
//       });
//     }
//   }
// }

// module.exports = new StaffController();

/**
 * ==========================================
 * Staff Controller
 * ==========================================
 */

const staffService = require("../services/staffService");

class StaffController {
  /**
   * ==========================================
   * DASHBOARD
   * ==========================================
   */

  async dashboard(req, res) {
    try {
      const result = await staffService.dashboard(req.user);

      return res.status(200).json(result);
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
   * COMPLETE COMPLAINT
   * ==========================================
   */

  async completeComplaint(req, res) {
    try {
      const result = await staffService.completeComplaint(
        req.user,
        req.params.id,
        req.file,
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
   * CANNOT COMPLETE
   * ==========================================
   */

  async cannotCompleteComplaint(req, res) {
    try {
      const result = await staffService.cannotCompleteComplaint(
        req.user,
        req.params.id,
        req.body,
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
}

module.exports = new StaffController();
