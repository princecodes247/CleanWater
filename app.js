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

app.listen(5000, () => console.log("listening"));
