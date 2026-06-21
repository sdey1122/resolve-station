/**
 * ==========================================
 * Auth Service
 * ==========================================
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  hashToken,
} = require("../utils/generateToken");

const { uploadProfileImage } = require("./cloudinaryService");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("./emailService");

const SALT_ROUNDS = 12;

class AuthService {
  /**
   * ==========================================
   * REGISTER USER
   * ==========================================
   */

  async registerUser(data, file) {
    const { name, email, password } = data;

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let profileImage = {
      publicId: null,

      url: process.env.DEFAULT_AVATAR_URL,

      uploadedAt: null,
    };

    if (file) {
      profileImage = await uploadProfileImage(file.buffer);
    }

    const verificationToken = generateVerificationToken();

    const hashedVerificationToken = hashToken(verificationToken);

    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,

      email: email.toLowerCase(),

      password: hashedPassword,

      role: "RESIDENT",

      profileImage,

      verificationToken: hashedVerificationToken,

      verificationTokenExpires,
    });

    const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email/${verificationToken}`;

    await sendVerificationEmail(user, verificationUrl);

    return {
      success: true,

      message: "Registration successful. Please verify your email address.",
    };
  }
  /**
   * ==========================================
   * VERIFY EMAIL
   * ==========================================
   */

  async verifyEmail(token) {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      verificationToken: hashedToken,

      verificationTokenExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw new Error("Invalid or expired verification link.");
    }

    user.isVerified = true;

    user.verificationToken = null;

    user.verificationTokenExpires = null;

    await user.save();

    return {
      success: true,

      message: "Email verification completed successfully.",
    };
  }
  /**
   * ==========================================
   * LOGIN USER
   * ==========================================
   */

  async loginUser(email, password, ipAddress) {
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    if (user.isDeleted) {
      throw new Error("This account has been removed.");
    }

    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in.");
    }

    if (user.isLocked) {
      throw new Error("Account locked. Please try again after 24 hours.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }

      await user.save();

      throw new Error("Invalid email or password.");
    }

    user.loginAttempts = 0;

    user.lockUntil = null;

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    user.lastLoginAt = new Date();

    user.lastLoginIP = ipAddress;

    await user.save();

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
  /**
   * ==========================================
   * LOGOUT USER
   * ==========================================
   */

  async logoutUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    user.refreshToken = null;

    await user.save();

    return {
      success: true,
      message: "Logged out successfully.",
    };
  }
  /**
   * ==========================================
   * REFRESH ACCESS TOKEN
   * ==========================================
   */


  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new Error("Refresh token is required.");
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired refresh token.");
    }

    const user = await User.findOne({
      _id: decoded.id,
      refreshToken,
    });

    if (!user) {
      throw new Error("Invalid refresh token.");
    }

    if (user.isDeleted) {
      throw new Error("This account has been removed.");
    }

    if (!user.isVerified) {
      throw new Error("Account is not verified.");
    }

    const accessToken = generateAccessToken(user);

    return {
      accessToken,
    };
  }
  /**
   * ==========================================
   * FORGOT PASSWORD
   * ==========================================
   */

  async forgotPassword(email) {
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      throw new Error("No account found with this email.");
    }

    const resetToken = generatePasswordResetToken();

    const hashedResetToken = hashToken(resetToken);

    user.passwordResetToken = hashedResetToken;

    user.passwordResetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetUrl = `${process.env.APP_URL}/auth/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user, resetUrl);

    return {
      success: true,
      message: "Password reset link sent successfully.",
    };
  }
  /**
   * ==========================================
   * RESET PASSWORD
   * ==========================================
   */

  async resetPassword(token, password) {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,

      passwordResetTokenExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw new Error("Invalid or expired reset link.");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    user.password = hashedPassword;

    user.passwordResetToken = null;

    user.passwordResetTokenExpires = null;

    user.refreshToken = null;

    await user.save();

    return {
      success: true,
      message: "Password changed successfully.",
    };
  }
}

module.exports = new AuthService();
