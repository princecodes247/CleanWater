const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

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
app.get("/contact-us", (req, res) => {
  res.render("contact-us");
});
app.get("/contact-us", (req, res) => {
  res.render("contact-us");
});
app.use("/about-us", require("./routes/about-us.js"));

app.listen(5000, () => console.log("listening"));
