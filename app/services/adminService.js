// /**
//  * ==========================================
//  * ADMIN SERVICE
//  * ==========================================
//  */

// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");

// const User = require("../models/User");

// const auditLogService = require("./auditLogService");

// const {
//   uploadProfileImage,
//   replaceProfileImage,
//   deleteProfileImage,
// } = require("./cloudinaryService");

// const {
//   sendStaffCredentialsEmail,
//   sendVerificationEmail,
// } = require("./emailService");

// const generatePassword = require("../utils/generatePassword");

// const SALT_ROUNDS = 12;

// class AdminService {
//   /**
//    * ==========================================
//    * CREATE STAFF
//    * ==========================================
//    */

//   async createStaff(data, file, adminUser, ipAddress) {
//     const name = data.name.trim();

//     const email = data.email.toLowerCase().trim();

//     const existingUser = await User.findOne({
//       email,
//       isDeleted: false,
//     });

//     if (existingUser) {
//       throw new Error("An account with this email already exists.");
//     }

//     let profileImage = {
//       publicId: null,
//       url: process.env.DEFAULT_AVATAR_URL,
//       uploadedAt: null,
//     };

//     if (file) {
//       const uploadedImage = await uploadProfileImage(file.buffer);

//       profileImage = {
//         publicId: uploadedImage.publicId,
//         url: uploadedImage.url,
//         uploadedAt: uploadedImage.uploadedAt || new Date(),
//       };
//     }

//     const temporaryPassword = generatePassword();

//     const hashedPassword = await bcrypt.hash(temporaryPassword, SALT_ROUNDS);

//     const staff = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "STAFF",
//       profileImage,
//       isVerified: true,
//     });

//     try {
//       await sendStaffCredentialsEmail(staff, temporaryPassword);
//     } catch (error) {
//       console.error(error);
//     }

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "CREATE_STAFF",
//       targetUser: staff._id,
//       details: `Created staff account (${staff.email})`,
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Staff account created successfully.",
//       staff,
//     };
//   }

//   /**
//    * ==========================================
//    * GET ALL STAFF
//    * ==========================================
//    */

//   async getAllStaff() {
//     const staff = await User.find({
//       role: "STAFF",
//       isDeleted: false,
//     })
//       .select(
//         "name email role profileImage isVerified lastLoginAt lastLoginIP createdAt",
//       )
//       .sort({
//         createdAt: -1,
//       });

//     return {
//       success: true,
//       count: staff.length,
//       staff,
//     };
//   }

//   /**
//    * ==========================================
//    * GET STAFF BY ID
//    * ==========================================
//    */

//   async getStaffById(staffId) {
//     const staff = await User.findOne({
//       _id: staffId,
//       role: "STAFF",
//       isDeleted: false,
//     });

//     if (!staff) {
//       throw new Error("Staff member not found.");
//     }

//     return {
//       success: true,
//       staff,
//     };
//   }

//   /**
//    * ==========================================
//    * UPDATE STAFF
//    * ==========================================
//    */

//   async updateStaff(staffId, data, file, adminUser, ipAddress) {
//     const staff = await User.findOne({
//       _id: staffId,
//       role: "STAFF",
//       isDeleted: false,
//     });

//     if (!staff) {
//       throw new Error("Staff member not found.");
//     }

//     const name = data.name.trim();

//     const email = data.email.toLowerCase().trim();

//     const existingUser = await User.findOne({
//       email,
//       _id: {
//         $ne: staffId,
//       },
//       isDeleted: false,
//     });

//     if (existingUser) {
//       throw new Error("An account with this email already exists.");
//     }

//     const emailChanged = staff.email !== email;

//     staff.name = name;
//     staff.email = email;

//     if (file) {
//       const uploadedImage = await replaceProfileImage(
//         staff.profileImage?.publicId,
//         file.buffer,
//       );

//       staff.profileImage = {
//         publicId: uploadedImage.publicId,
//         url: uploadedImage.url,
//         uploadedAt: uploadedImage.uploadedAt || new Date(),
//       };
//     }

//     if (emailChanged) {
//       const newPassword = generatePassword();

//       staff.password = await bcrypt.hash(newPassword, SALT_ROUNDS);

//       try {
//         await sendStaffCredentialsEmail(staff, newPassword);
//       } catch (error) {
//         console.error(error);
//       }
//     }

//     await staff.save();

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "UPDATE_STAFF",
//       targetUser: staff._id,
//       details: `Updated staff account (${staff.email})`,
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Staff updated successfully.",
//       staff,
//     };
//   }
//   /**
//    * ==========================================
//    * GET DELETED STAFF
//    * ==========================================
//    */

//   async getDeletedStaff() {
//     const staff = await User.find({
//       role: "STAFF",
//       isDeleted: true,
//     })
//       .select("name email role profileImage deletedAt createdAt")
//       .sort({
//         deletedAt: -1,
//       });

//     return {
//       success: true,
//       count: staff.length,
//       staff,
//     };
//   }

//   /**
//    * ==========================================
//    * SOFT DELETE STAFF
//    * ==========================================
//    */

//   async deleteStaff(staffId, adminUser, ipAddress) {
//     const staff = await User.findOne({
//       _id: staffId,
//       role: "STAFF",
//       isDeleted: false,
//     });

//     if (!staff) {
//       throw new Error("Staff member not found.");
//     }

//     staff.isDeleted = true;
//     staff.deletedAt = new Date();

//     await staff.save();

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "DELETE_STAFF",
//       targetUser: staff._id,
//       details: `Moved staff (${staff.email}) to Account Trash`,
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Staff moved to Account Trash successfully.",
//     };
//   }

//   /**
//    * ==========================================
//    * RESTORE STAFF
//    * ==========================================
//    */

//   async restoreStaff(staffId, adminUser, ipAddress) {
//     const staff = await User.findOne({
//       _id: staffId,
//       role: "STAFF",
//       isDeleted: true,
//     });

//     if (!staff) {
//       throw new Error("Staff member not found.");
//     }

//     staff.isDeleted = false;
//     staff.deletedAt = null;

//     await staff.save();

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "RESTORE_STAFF",
//       targetUser: staff._id,
//       details: `Restored staff (${staff.email})`,
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Staff restored successfully.",
//     };
//   }

//   /**
//    * ==========================================
//    * PERMANENT DELETE STAFF
//    * ==========================================
//    */

//   async permanentlyDeleteStaff(staffId, adminUser, ipAddress) {
//     const staff = await User.findById(staffId);

//     if (!staff) {
//       throw new Error("Staff not found.");
//     }

//     const email = staff.email;

//     if (staff.profileImage?.publicId) {
//       await deleteProfileImage(staff.profileImage.publicId);
//     }

//     await User.findByIdAndDelete(staffId);

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "PERMANENT_DELETE_STAFF",
//       details: `Permanently deleted staff (${email})`,
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Staff permanently deleted.",
//     };
//   }
//   /**
//    * ==========================================
//    * GET ALL RESIDENTS
//    * ==========================================
//    */

//   async getAllResidents() {
//     const residents = await User.find({
//       role: "RESIDENT",
//       isDeleted: false,
//     })
//       .select(
//         "name email role profileImage isVerified lastLoginAt lastLoginIP createdAt",
//       )
//       .sort({
//         createdAt: -1,
//       });

//     return {
//       success: true,
//       count: residents.length,
//       residents,
//     };
//   }

//   /**
//    * ==========================================
//    * GET RESIDENT BY ID
//    * ==========================================
//    */

//   async getResidentById(residentId) {
//     const resident = await User.findOne({
//       _id: residentId,
//       role: "RESIDENT",
//       isDeleted: false,
//     });

//     if (!resident) {
//       throw new Error("Resident not found.");
//     }

//     return {
//       success: true,
//       resident,
//     };
//   }

//   /**
//    * ==========================================
//    * UPDATE RESIDENT
//    * ==========================================
//    */

//   async updateResident(residentId, data, file, adminUser, ipAddress) {
//     const resident = await User.findOne({
//       _id: residentId,
//       role: "RESIDENT",
//       isDeleted: false,
//     });

//     if (!resident) {
//       throw new Error("Resident not found.");
//     }

//     const name = data.name.trim();
//     const email = data.email.toLowerCase().trim();

//     const existingUser = await User.findOne({
//       email,
//       _id: { $ne: residentId },
//       isDeleted: false,
//     });

//     if (existingUser) {
//       throw new Error("An account with this email already exists.");
//     }

//     resident.name = name;

//     const emailChanged = resident.email !== email;

//     resident.email = email;

//     if (file) {
//       const uploadedImage = await replaceProfileImage(
//         resident.profileImage?.publicId,
//         file.buffer,
//       );

//       resident.profileImage = {
//         publicId: uploadedImage.publicId,
//         url: uploadedImage.url,
//         uploadedAt: uploadedImage.uploadedAt || new Date(),
//       };
//     }

//     if (emailChanged) {
//       resident.isVerified = false;

//       resident.verificationToken = crypto.randomBytes(32).toString("hex");

//       resident.verificationTokenExpires = new Date(
//         Date.now() + 24 * 60 * 60 * 1000,
//       );

//       const verificationUrl =
//         `${process.env.APP_URL}/api/auth/verify-email/` +
//         resident.verificationToken;

//       await sendVerificationEmail(resident, verificationUrl);
//     }

//     await resident.save();

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "UPDATE_RESIDENT",
//       targetUser: resident._id,
//       details: `Updated resident account (${resident.email})`,
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Resident updated successfully.",
//       resident,
//     };
//   }

//   /**
//    * ==========================================
//    * GET DELETED RESIDENTS
//    * ==========================================
//    */

//   async getDeletedResidents() {
//     const residents = await User.find({
//       role: "RESIDENT",
//       isDeleted: true,
//     })
//       .select("name email role profileImage deletedAt createdAt")
//       .sort({
//         deletedAt: -1,
//       });

//     return {
//       success: true,
//       count: residents.length,
//       residents,
//     };
//   }

//   /**
//    * ==========================================
//    * SOFT DELETE RESIDENT
//    * ==========================================
//    */

//   async deleteResident(residentId, adminUser, ipAddress) {
//     const resident = await User.findOne({
//       _id: residentId,
//       role: "RESIDENT",
//       isDeleted: false,
//     });

//     if (!resident) {
//       throw new Error("Resident not found.");
//     }

//     resident.isDeleted = true;
//     resident.deletedAt = new Date();

//     await resident.save();

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "DELETE_RESIDENT",
//       targetUser: resident._id,
//       details: `Moved resident (${resident.email}) to Account Trash`,
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Resident moved to Account Trash successfully.",
//     };
//   }

//   /**
//    * ==========================================
//    * RESTORE RESIDENT
//    * ==========================================
//    */

//   async restoreResident(residentId, adminUser, ipAddress) {
//     const resident = await User.findOne({
//       _id: residentId,
//       role: "RESIDENT",
//       isDeleted: true,
//     });

//     if (!resident) {
//       throw new Error("Resident not found.");
//     }

//     resident.isDeleted = false;
//     resident.deletedAt = null;

//     await resident.save();

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "RESTORE_RESIDENT",
//       targetUser: resident._id,
//       details: `Restored resident (${resident.email})`,
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Resident restored successfully.",
//     };
//   }

//   /**
//    * ==========================================
//    * PERMANENT DELETE RESIDENT
//    * ==========================================
//    */

//   async permanentlyDeleteResident(residentId, adminUser, ipAddress) {
//     const resident = await User.findById(residentId);

//     if (!resident) {
//       throw new Error("Resident not found.");
//     }

//     const email = resident.email;

//     if (resident.profileImage?.publicId) {
//       await deleteProfileImage(resident.profileImage.publicId);
//     }

//     await User.findByIdAndDelete(residentId);

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "PERMANENT_DELETE_RESIDENT",
//       details: `Permanently deleted resident (${email})`,
//       ipAddress: ipAddress?.startsWith("::ffff:")
//         ? ipAddress.replace("::ffff:", "")
//         : ipAddress === "::1"
//           ? "127.0.0.1"
//           : ipAddress,
//     });

//     return {
//       success: true,
//       message: "Resident permanently deleted.",
//     };
//   }
//   /**
//    * ==========================================
//    * GET ADMIN PROFILE
//    * ==========================================
//    */

//   async getProfile(adminId) {
//     const admin = await User.findOne({
//       _id: adminId,
//       role: "ADMIN",
//       isDeleted: false,
//     }).select("name email role profileImage description createdAt");

//     if (!admin) {
//       throw new Error("Administrator not found.");
//     }

//     return {
//       success: true,
//       admin,
//     };
//   }

//   /**
//    * ==========================================
//    * UPDATE ADMIN PROFILE
//    * ==========================================
//    */

//   async updateProfile(adminId, data, file, adminUser, ipAddress) {
//     const admin = await User.findOne({
//       _id: adminId,
//       role: "ADMIN",
//       isDeleted: false,
//     });

//     if (!admin) {
//       throw new Error("Administrator not found.");
//     }

//     admin.description = (data.description || "").trim();

//     if (file) {
//       const uploadedImage = await replaceProfileImage(
//         admin.profileImage?.publicId,
//         file.buffer,
//       );

//       admin.profileImage = {
//         publicId: uploadedImage.publicId,
//         url: uploadedImage.url,
//         uploadedAt: uploadedImage.uploadedAt || new Date(),
//       };
//     }

//     await admin.save();

//     await auditLogService.createLog({
//       performedBy: adminUser._id,
//       role: adminUser.role,
//       action: "UPDATE_PROFILE",
//       targetUser: admin._id,
//       details: "Updated administrator profile.",
//       ipAddress,
//     });

//     return {
//       success: true,
//       message: "Profile updated successfully.",
//       admin,
//     };
//   }
// }

// module.exports = new AdminService();

/**
 * ==========================================
 * ADMIN SERVICE
 * ==========================================
 */

const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");

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
}
module.exports = new AdminService();
