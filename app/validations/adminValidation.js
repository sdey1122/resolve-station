/**
 * ==========================================
 * Admin Validation
 * ==========================================
 */

const Joi = require("joi");

/**
 * ==========================================
 * CREATE STAFF
 * ==========================================
 */

const createStaffValidation = Joi.object({
  name: Joi.string().trim().min(3).max(32).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters.",
    "string.max": "Name cannot exceed 32 characters.",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
  }),
});

module.exports = {
  createStaffValidation,
};
