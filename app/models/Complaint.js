const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    /**
     * ==========================================
     * COMPLAINT ID
     * ==========================================
     */

    complaintNumber: {
      type: String,
      unique: true,
      required: true,
    },

    /**
     * ==========================================
     * RELATIONS
     * ==========================================
     */

    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /**
     * ==========================================
     * COMPLAINT INFORMATION
     * ==========================================
     */

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      enum: [
        "Electrical",
        "Plumbing",
        "Cleaning",
        "Water",
        "Internet",
        "Lift",
        "Parking",
        "Security",
        "Garden",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },

    /**
     * ==========================================
     * INCIDENT
     * ==========================================
     */

    incidentDate: {
      type: Date,
      required: true,
    },

    incidentTime: {
      type: String,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    /**
     * ==========================================
     * IMAGE
     * ==========================================
     */

    image: {
      publicId: {
        type: String,
        default: null,
      },

      url: {
        type: String,
        default: null,
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },

    /**
     * ==========================================
     * STATUS
     * ==========================================
     */

    status: {
      type: String,
      status: {
        type: String,
        enum: [
          "SUBMITTED",
          "REJECTED",
          "RESUBMITTED",

          "APPROVED",
          "ASSIGNED",
          "IN_PROGRESS",

          "PENDING_REVIEW",
          "COMPLETION_REJECTED",

          "COMPLETED",

          "CANNOT_COMPLETE",

          "CLOSED",
        ],
        default: "SUBMITTED",
      },
      default: "SUBMITTED",
    },

    /**
     * ==========================================
     * PRIORITY
     * ==========================================
     */

    // priority: {
    //   type: String,
    //   enum: ["CRITICAL", "VERY_URGENT", "URGENT", "DUE", "OVERDUE"],
    //   default: "URGENT",
    // },

    /**
     * ==========================================
     * REMARKS
     * ==========================================
     */

    adminRemark: {
      type: String,
      default: "",
      trim: true,
    },

    completionRemark: {
      type: String,
      default: "",
      trim: true,
    },

    cannotCompleteRemark: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * ==========================================
     * PRICE
     * ==========================================
     */

    estimatedPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    deductionPercent: {
      type: Number,
      default: 0,
    },

    /**
     * ==========================================
     * COMPLETION IMAGE
     * ==========================================
     */

    completionImage: {
      publicId: {
        type: String,
        default: null,
      },

      url: {
        type: String,
        default: null,
      },

      uploadedAt: {
        type: Date,
        default: null,
      },
    },

    /**
     * ==========================================
     * DEADLINE
     * ==========================================
     */

    deadlineAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    /**
     * ==========================================
     * TIMELINE
     * ==========================================
     */

    timeline: [
      {
        action: String,

        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        description: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Complaint", complaintSchema);
