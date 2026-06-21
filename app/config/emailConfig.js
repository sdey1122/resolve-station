/**
 * ==========================================
 * Email Configuration
 * ==========================================
 */

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,

  port: process.env.EMAIL_PORT,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },
});

/**
 * ==========================================
 * VERIFY CONNECTION
 * ==========================================
 */

if (process.env.NODE_ENV === "development") {
  transporter.verify((error) => {
    if (error) {
      console.error("Email Configuration Error:", error.message);
    } else {
      console.log("Email Service Connected");
    }
  });
}

module.exports = transporter;
