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

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login");
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
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log(user);
      if (user) {
        console.log("kk");
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const username = user.username;
          generateToken(res, username);
        } else {
          console.log("wrong");
          res.json({ error: "Password is incorrect" });
        }
      }
      res.json({ error: "User doesn't exist" });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

module.exports = router;
