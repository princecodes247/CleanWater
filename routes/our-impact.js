const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("our-impact/our-impact");
});
router.get("/where-we-work", (req, res) => {
  res.render("our-impact/where-we-work");
});
router.get("/water-crisis", (req, res) => {
  res.render("our-impact/crisis/water-crisis");
});
router.get("/", (req, res) => {
  res.render("our-impact/our-impact");
});

module.exports = router;
