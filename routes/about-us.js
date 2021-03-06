const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("about-us/about-us");
});
router.get("/founders-board-team", (req, res) => {
  res.render("about-us/founders-board-team");
});
router.get("/why-water", (req, res) => {
  res.render("about-us/why-water");
});
router.get("/ways-donate", (req, res) => {
  res.render("about-us/ways-donate/ways-donate");
});
router.get("/ways-donate/start-fundraiser", (req, res) => {
  res.render("about-us/ways-donate/start-fundraiser");
});
router.get("/ways-donate/planned-giving", (req, res) => {
  res.render("about-us/ways-donate/planned-giving");
});
router.get("/ways-donate/shop-support", (req, res) => {
  res.render("about-us/ways-donate/shop-support");
});
router.get("/ways-donate/cause-marketing", (req, res) => {
  res.render("about-us/ways-donate/cause-marketing");
});
router.get("/resources", (req, res) => {
  res.render("about-us/resources");
});
router.get("/news-press", (req, res) => {
  res.render("about-us/news-press");
});

module.exports = router;
