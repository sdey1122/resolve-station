/**
 * ==========================================
 * User Model
 * ==========================================
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    /**
     * ==========================================
     * BASIC INFORMATION
     * ==========================================
     */

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    /**
     * ==========================================
     * PROFILE IMAGE
     * ==========================================
     */

    profileImage: {
      publicId: {
        type: String,
        default: null,
      },

      url: {
        type: String,
        default: process.env.DEFAULT_AVATAR_URL,
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },

    /**
     * ==========================================
     * ADMIN DESCRIPTION
     * ==========================================
     */

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    /**
     * ==========================================
     * ROLE MANAGEMENT
     * ==========================================
     */

    role: {
      type: String,

      enum: ["ADMIN", "STAFF", "RESIDENT"],

      default: "RESIDENT",

      index: true,
    },

    /**
     * ==========================================
     * PROFILE STATUS
     * ==========================================
     */

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    /**
     * ==========================================
     * EMAIL VERIFICATION
     * ==========================================
     */

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    verificationTokenExpires: {
      type: Date,
      default: null,
    },

    /**
     * ==========================================
     * PASSWORD RESET
     * ==========================================
     */

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },

    /**
     * ==========================================
     * LOGIN SECURITY
     * ==========================================
     */

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    /**
     * ==========================================
     * AUTHENTICATION
     * ==========================================
     */

    refreshToken: {
      type: String,
      default: null,
    },

    /**
     * ==========================================
     * LOGIN TRACKING
     * ==========================================
     */

    lastLoginAt: {
      type: Date,
      default: null,
    },

    lastLoginIP: {
      type: String,
      default: null,
    },

    /**
     * ==========================================
     * SOFT DELETE
     * ==========================================
     */

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
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

userSchema.index({ isDeleted: 1 });

userSchema.index({ createdAt: -1 });

/**
 * ==========================================
 * VIRTUALS
 * ==========================================
 */

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

/**
 * ==========================================
 * EXPORT MODEL
 * ==========================================
 */

const User = mongoose.model("User", userSchema);

module.exports = User;
