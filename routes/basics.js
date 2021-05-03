const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});
router.get("/faq", (req, res) => {
  res.render("faq");
});
router.get("/financials", (req, res) => {
  res.render("financials/financial");
});
router.get("/health-our-world-starts-access-safe-water", (req, res) => {
  res.render("health-our-world-starts-access-safe-water");
});
router.get("/financials/2019", (req, res) => {
  res.render("financials/2019");
});
router.get("/donate", (req, res) => {
  res.render("donate");
});
router.get("/invest", (req, res) => {
  res.render("invest");
});
router.get("/contact-us", (req, res) => {
  res.render("contact-us");
});
router.get("/our-vision", (req, res) => {
  res.render("our-vision");
});
router.get("/monthly-giving", (req, res) => {
  res.render("monthly-giving");
});
router.get("/partners", (req, res) => {
  res.render("partners");
});

router.get("/careers", (req, res) => {
  res.render("careers");
});
router.get("/news-press", (req, res) => {
  res.render("news-press");
});
router.get("/resources", (req, res) => {
  res.render("resources");
});
router.get("/subscribe", (req, res) => {
  res.render("subscribe");
});

module.exports = router;
