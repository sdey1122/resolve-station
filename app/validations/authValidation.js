/**
 * ==========================================
 * Authentication Validation
 * ==========================================
 */

const Joi = require("joi");

/**
 * ==========================================
 * REGISTER VALIDATION
 * ==========================================
 */

const registerValidation = Joi.object({
  name: Joi.string().trim().min(3).max(32).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters.",
    "string.max": "Name cannot exceed 32 characters.",
    "any.required": "Name is required.",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),

  password: Joi.string()
    .min(9)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 9 characters.",
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 special character.",
      "any.required": "Password is required.",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
    "string.empty": "Confirm Password is required.",
    "any.required": "Confirm Password is required.",
  }),
});

/**
 * ==========================================
 * LOGIN VALIDATION
 * ==========================================
 */

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

/**
 * ==========================================
 * FORGOT PASSWORD VALIDATION
 * ==========================================
 */

const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email address.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),
});

/**
 * ==========================================
 * RESET PASSWORD VALIDATION
 * ==========================================
 */

const resetPasswordValidation = Joi.object({
  password: Joi.string()
    .min(9)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/)
    .required()
    .messages({
      "string.min": "Password must be at least 9 characters.",
      "string.pattern.base":
        "Password must contain at least 1 uppercase letter, 1 lowercase letter and 1 special character.",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
});

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
