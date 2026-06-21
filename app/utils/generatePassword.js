/**
 * ==========================================
 * Generate Temporary Password
 * ==========================================
 */

const crypto = require("crypto");

const generatePassword = () => {
  return "RS@" + crypto.randomBytes(4).toString("hex");
};

module.exports = generatePassword;
