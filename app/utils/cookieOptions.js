/**
 * ==========================================
 * Cookie Options
 * ==========================================
 */

const isProduction = process.env.NODE_ENV === "production";

/**
 * ==========================================
 * ACCESS TOKEN COOKIE
 * ==========================================
 */

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

/**
 * ==========================================
 * REFRESH TOKEN COOKIE
 * ==========================================
 */

const refreshTokenCookieOptions = {
  httpOnly: true,

  secure: isProduction,

  sameSite: "lax",

  maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
};
