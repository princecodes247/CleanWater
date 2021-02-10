const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("solutions/solutions");
});

router.get("/waterequity", (req, res) => {
  res.render("solutions/waterequity");
});
router.get("/watercredit", (req, res) => {
  res.render("solutions/watercredit");
});

router.get("/global-engagement", (req, res) => {
  res.render("solutions/global-engagement");
});
router.get("/monitoring-evaluation", (req, res) => {
  res.render("solutions/monitoring-evaluation");
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
