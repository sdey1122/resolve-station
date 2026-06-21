/**
 * ==========================================
 * Auth Controller
 * ==========================================
 */

const authService = require("../services/authService");

const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/authValidation");

const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} = require("../utils/cookieOptions");

class AuthController {
  /**
   * ==========================================
   * REGISTER
   * ==========================================
   */

  async register(req, res) {
    try {
      const { error } = registerValidation.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,

          errors: error.details.map((err) => err.message),
        });
      }

      const result = await authService.registerUser(req.body, req.file);

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }
  /**
   * ==========================================
   * VERIFY EMAIL
   * ==========================================
   */

  async verifyEmail(req, res) {
    try {
      await authService.verifyEmail(req.params.token);

      return res.render("auth/verify-success");
    } catch (error) {
      return res.render("auth/verify-failed", {
        error: error.message,
      });
    }
  }
  /**
   * ==========================================
   * LOGIN
   * ==========================================
   */

  async login(req, res) {
    try {
      const { error } = loginValidation.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,

          message: error.details[0].message,
        });
      }

      const ipAddress = (
        req.headers["x-forwarded-for"] || req.socket.remoteAddress
      )
        ?.toString()
        .replace("::ffff:", "");

      const result = await authService.loginUser(
        req.body.email,
        req.body.password,
        ipAddress,
      );

      res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);

      res.cookie(
        "refreshToken",
        result.refreshToken,
        refreshTokenCookieOptions,
      );

      return res.status(200).json({
        success: true,

        message: "Login successful.",

        user: {
          id: result.user._id,

          name: result.user.name,

          email: result.user.email,

          role: result.user.role,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }
  /**
   * ==========================================
   * LOGOUT
   * ==========================================
   */

  async logout(req, res) {
    try {
      await authService.logoutUser(req.user.id);

      res.clearCookie("accessToken", accessTokenCookieOptions);

      res.clearCookie("refreshToken", refreshTokenCookieOptions);

      return res.status(200).json({
        success: true,

        message: "Logged out successfully.",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }
  /**
   * ==========================================
   * FORGOT PASSWORD
   * ==========================================
   */

  async forgotPassword(req, res) {
    try {
      const { error } = forgotPasswordValidation.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,

          message: error.details[0].message,
        });
      }

      const result = await authService.forgotPassword(req.body.email);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }
  /**
   * ==========================================
   * RESET PASSWORD
   * ==========================================
   */

  async resetPassword(req, res) {
    try {
      const { error } = resetPasswordValidation.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,

          message: error.details[0].message,
        });
      }

      const result = await authService.resetPassword(
        req.params.token,
        req.body.password,
      );

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }
  }
  /**
   * ==========================================
   * REFRESH ACCESS TOKEN
   * ==========================================
   */

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      const result = await authService.refreshAccessToken(refreshToken);

      res.cookie("accessToken", result.accessToken, accessTokenCookieOptions);

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,

        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
