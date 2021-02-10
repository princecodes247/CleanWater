const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // REMEMBER TO INCLUDE UNIQUE VALIDATORS
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    required: false,
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);
