const bcrypt = require("bcryptjs");
const Code = require("../models/secretCode");
//const cryptoRandomString = require("crypto-random-string");
const dotenv = require("dotenv");
const generateToken = require("../utils/generateToken");
const express = require("express");
//const Oauth = require("../utils/Oauth");
const router = express.Router();
const sendCode = require("../utils/sendCode");
const sendMail = require("../utils/sendMail");
const User = require("../models/user");
//const userInfo = require("../utils/getUserInfo");

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
                return;
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
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const username = user.username;
          generateToken(res, username);
          return;
        } else {
          res.json({ error: "Password is incorrect" });
          return;
        }
      }
      res.json({ error: "User doesn't exist" });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

// User Account Verification
router.get(
  "/verification/verify-account/:userId/:secretCode",
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const response = await Code.findOne({
        email: user.email,
        code: req.params.secretCode,
      });

      if (!user) {
        console.log("User not found");
      } else {
        await User.updateOne({ email: user.email }, { status: "active" });
        await Code.deleteMany({ email: user.email });

        let redirectPath;

        if (process.env.NODE_ENV == "production") {
          redirectPath = `${req.protocol}://${req.get("host")}account/verified`;
        } else {
          redirectPath = `http://127.0.0.1:5000/account/verified`;
        }

        res.redirect(redirectPath);
      }
    } catch (err) {
      console.log("Verification failed...");
    }
  }
);

// Verification Redirect Route
router.get("/account/verified", (req, res) => {
  res.send("<h1> You're Verified</h1>");
  // res.redirect("/home")
});

// Password Reset Route #1
// Sends Reset Link to a Registered Email Address
router.post("/forgot", (req, res) => {
  const email = req.body.email;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.json({ message: "This email address is not registered" });
      } else {
        const token = cryptoRandomString({ length: 12 });
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save((err, user) => {
          if (err) return console.log({ err });
          console.log("Token updated");
          sendCode(req, user, token);
        });
      }
      return;
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

// Password Reset Route #2
// Verifies Token and Renders Reset Page
router.get("/reset/:token", (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    (err, user) => {
      if (!user) {
        res.json({
          message: "Password reset token is invalid or has expired.",
        });
        return res.redirect("/forgot");
      }
      res.send("<h1> You can reset your password</h1>");
      // res.render('reset', {user: req.user});
    }
  );
});

// Password Reset Route #3
// Verifies Token and Sets New Password for the account
router.post("/reset/:token", (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    (err, user) => {
      if (!user) {
        res.json({
          message: "Password reset token is invalid or has expired.",
        });
        return res.redirect("/forgot");
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save((err) => {
          res.json({ message: "Password has been reset" });
        });
      });
    }
  );
});

module.exports = router;
