/**
 * ==========================================
 * Profile Validation
 * ==========================================
 */

const Joi = require("joi");

/**
 * ==========================================
 * CHANGE PASSWORD
 * ==========================================
 */

const changePasswordValidation = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required.",
    "any.required": "Current password is required.",
  }),

  newPassword: Joi.string()
    .min(8)
    .max(32)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .messages({
      "string.empty": "New password is required.",
      "string.min": "Password must contain at least 8 characters.",
      "string.max": "Password cannot exceed 32 characters.",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character.",
    }),
});

module.exports = {
  changePasswordValidation,
};
