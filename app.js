const bodyParser = require("body-parser");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

// For Static files
app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.send("hi");
// });
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/faq", (req, res) => {
  res.render("faq");
});
app.get("/financials", (req, res) => {
  res.render("financials/financial");
});
app.get("/financials/2019", (req, res) => {
  res.render("financials/2019");
});
app.get("/donate", (req, res) => {
  res.render("donate");
});
app.get("/invest", (req, res) => {
  res.render("invest");
});
app.get("/contact-us", (req, res) => {
  res.render("contact-us");
});
app.get("/our-vision", (req, res) => {
  res.render("our-vision");
});
app.get("/monthly-giving", (req, res) => {
  res.render("monthly-giving");
});
app.get("/partners", (req, res) => {
  res.render("partners");
});

app.get("/careers", (req, res) => {
  res.render("careers");
});
app.get("/news-press", (req, res) => {
  res.render("news-press");
});
app.get("/resources", (req, res) => {
  res.render("resources");
});
app.get("/subscribe", (req, res) => {
  res.render("subscribe");
});
app.get("/confirm", (req, res) => {
  res.render("confirm-email");
});
app.use("/", require("./routes/users.js"));
app.use("/", require("./routes/verification.js"));
app.use("/about-us", require("./routes/about-us.js"));
app.use("/our-impact", require("./routes/our-impact.js"));
app.use("/solutions", require("./routes/solutions.js"));

app.listen(PORT, () => console.log("listening"));
