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
  balance: {
    type: Number,
    default: 0,
    required: false,
  },
  deposit: {
    type: Number,
    default: 0,
    required: false,
  },
  lastDeposit: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  messages: {
    type: Array,
    default: [],
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
