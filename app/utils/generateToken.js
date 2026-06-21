/**
 * ==========================================
 * Token Utilities
 * ==========================================
 */

const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");

/**
 * ==========================================
 * ACCESS TOKEN
 * ==========================================
 */

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

/**
 * ==========================================
 * REFRESH TOKEN
 * ==========================================
 */

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

/**
 * ==========================================
 * EMAIL VERIFICATION TOKEN
 * ==========================================
 */

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * ==========================================
 * PASSWORD RESET TOKEN
 * ==========================================
 */

const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * ==========================================
 * HASH TOKEN
 * ==========================================
 */

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  hashToken,
};
