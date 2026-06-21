/**
 * ==========================================
 * Audit Log Model
 * ==========================================
 */

const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    /**
     * ==========================================
     * WHO PERFORMED THE ACTION
     * ==========================================
     */

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * ==========================================
     * USER ROLE
     * ==========================================
     */

    role: {
      type: String,
      enum: ["ADMIN", "STAFF", "RESIDENT"],
      required: true,
    },

    /**
     * ==========================================
     * ACTION
     * ==========================================
     */

    action: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * ==========================================
     * TARGET USER
     * ==========================================
     */

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /**
     * ==========================================
     * DETAILS
     * ==========================================
     */

    details: {
      type: String,
      default: null,
    },

    /**
     * ==========================================
     * IP ADDRESS
     * ==========================================
     */

    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * ==========================================
 * INDEXES
 * ==========================================
 */

auditLogSchema.index({
  performedBy: 1,
});

auditLogSchema.index({
  role: 1,
});

auditLogSchema.index({
  createdAt: -1,
});

/**
 * ==========================================
 * EXPORT MODEL
 * ==========================================
 */

module.exports = mongoose.model("AuditLog", auditLogSchema);
