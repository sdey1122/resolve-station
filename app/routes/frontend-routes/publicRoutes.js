const express = require("express");
const guestMiddleware = require("../../middlewares/guestMiddleware");
const router = express.Router();

router.get("/", guestMiddleware, (req, res) => {
  res.render("public/home");
});

router.get("/about", guestMiddleware, (req, res) => {
  res.render("public/about");
});

router.get("/contact", guestMiddleware, (req, res) => {
  res.render("public/contact");
});

module.exports = router;
