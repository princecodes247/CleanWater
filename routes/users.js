const bcrypt = require("bcrypt");
const Code = require("../models/secretCode");
const cryptoRandomString = require("crypto-random-string");
const dotenv = require("dotenv");
const generateToken = require("../utils/generateToken");
const express = require("express");
const Oauth = require("../utils/Oauth");
const router = express.Router();
const sendCode = require("../utils/sendCode");
const sendMail = require("../utils/sendMail");
const User = require("../models/user");
const userInfo = require("../utils/getUserInfo");
const passport = require("passport");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get("/admin", ensureAuthenticated, (req, res, next) => {
  if (req.user.level == 2) {
    User.find().then((result) => {
      let dummy = ({
        firstName,
        lastName,
        email,
        dateCreated,
        lastDeposit,
        deposit,
        balance,
        status,
      } = result);
      res.render("admin", {
        users: dummy,
      });
    });
    setTimeout(() => {
      console.clear();
      console.log("ran");
    }, 2000);
    next();
  }
  res.redirect("/dashboard");

  setTimeout(() => {
    console.clear();
    console.log("ransss");
  }, 2000);
});

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login", { error: { type: "none" } });
});
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// Register User
router.post("/register", (req, res) => {
  let { firstName, lastName, email, password, password2 } = req.body;
  firstName = firstName.toString().trim();
  lastName = lastName.toString().trim();
  email = email.toString().trim();
  password = password.toString().trim();
  password2 = password2.toString().trim();
  let userData = {
    firstName,
    lastName,
    email,
    password,
    password2,
  };
  User.findOne({
    email,
  })
    .then((user) => {
      if (!user) {
        if (password == password2) {
          bcrypt.hash(password, 10, (err, hash) => {
            userData.password = hash;
            User.create(userData)
              .then((user) => {
                console.log("User Registered");
                sendMail(req, user);
                res.render("confirm-email");
              })
              .catch((err) => {
                console.log({ err });
                return;
              });
          });
        } else {
          res.json({ error: "Password do not match" });
        }
      } else {
        res.json({ error: "The provided email is registered already" });
        return;
      }
    })
    .catch((err) => {
      res.send({ error: err });
      return;
    });
});

// Login User
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;
