const mongoose = require("mongoose");

const SessionSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  sessionID: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    // REMEMBER TO INCLUDE UNIQUE VALIDATORS
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    required: false,
  },
});

const Session = mongoose.model("Session", SessionSchema);
module.exports = Session;
