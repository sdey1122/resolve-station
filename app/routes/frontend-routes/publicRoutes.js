const express = require("express");

const router = express.Router();

/**
 * Home Page Route
 *
 * Renders the public landing page.
 */
router.get("/", (req, res) => {
  res.render("public/home");
});

/**
 * About Page Route
 */
router.get("/about", (req, res) => {
  res.render("public/about");
});

/**
 * Contact Page Route
 */
router.get("/contact", (req, res) => {
  res.render("public/contact");
});

module.exports = router;
