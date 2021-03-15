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

router.get("/admin", ensureAuthenticated, (req, res) => {
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
});

router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login", { error: { type: "none" } });
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
    successRedirect: "/admin",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;

// User.findOne({ email: req.body.email })
//     .then((user) => {
//       console.log(user);
//       if (user) {
//         console.log("kk");
//         if (bcrypt.compareSync(req.body.password, user.password)) {
//           const username = user.username;
//           console.log("kkw");
//           generateToken(res, username);
//           let incrementDays = Date.now() - user.lastDeposit;
//           incrementDays = incrementDays / 86400000;
//           //console.log(`last date was  ${incrementDays} days`);
//           if (incrementDays >= 10) {
//             // the user balance is set to be increased
//             // by 10% every 10 days
//             let numberOfIncrements = Math.floor(incrementDays / 10);
//             //console.log(numberOfIncrements);
//             user.balance =
//               user.balance + Math.floor(user.deposit / 10) * numberOfIncrements;

//             user.lastDeposit = Date.now();
//             user.save((err, user) => {
//               if (err) return console.log({ err });
//               console.log("Wallet Incremented");
//             });
//           }
//           res.render("dashboard", { user });
//         } else {
//           console.log("wrong");
//           res.render("login", {
//             error: { type: "password", body: "Wrong password" },
//           });
//           //res.json({ error: "Password is incorrect" });
//         }
//       } else {
//         //res.json({ error: "User doesn't exist" });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
