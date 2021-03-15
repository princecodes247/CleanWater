const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Load User model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      (username, password, done) => {
        // Match user
        User.findOne({
          email: username,
        }).then((user) => {
          if (!user) {
            return done(null, false, { message: "No such registered user" });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              walletControl(user);
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

function walletControl(user) {
  let incrementDays = Date.now() - user.lastDeposit;
  incrementDays = incrementDays / 86400000;
  //console.log(`last date was  ${incrementDays} days`);
  if (incrementDays >= 10) {
    // the user balance is set to be increased
    // by 10% every 10 days
    let numberOfIncrements = Math.floor(incrementDays / 10);
    //console.log(numberOfIncrements);
    user.balance =
      user.balance + Math.floor(user.deposit / 10) * numberOfIncrements;

    user.lastDeposit = Date.now();
  }
}
