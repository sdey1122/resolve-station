/**
 * ==========================================
 * COMPLAINT VALIDATION
 * ==========================================
 */

const Joi = require("joi");

const createComplaintValidation = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Complaint title is required.",
    "string.min": "Complaint title must be at least 3 characters.",
    "string.max": "Complaint title cannot exceed 100 characters.",
  }),

  category: Joi.string()
    .valid(
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
    )
    .required()
    .messages({
      "any.only": "Please select a valid complaint category.",
      "string.empty": "Complaint category is required.",
    }),

  description: Joi.string().trim().min(10).max(1000).required().messages({
    "string.empty": "Complaint description is required.",
    "string.min": "Complaint description must be at least 10 characters.",
    "string.max": "Complaint description cannot exceed 1000 characters.",
  }),

  incidentDate: Joi.date().required().messages({
    "date.base": "Please select a valid incident date.",
    "any.required": "Incident date is required.",
  }),

  incidentTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "Please select a valid incident time.",
      "any.required": "Incident time is required.",
    }),
});

module.exports = {
  createComplaintValidation,
};
