const bodyParser = require("body-parser");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {});
const Session = require("./models/sessions");
const User = require("./models/user");
// const balanceControl = require("./utils/balanceControl");

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// Connect flash for flash sessions
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// For Static files
app.use(express.static("public"));

// Calls a function that checks and controls the balance of all the users every 1day

function randomID() {
  let id = `${String.fromCharCode(
    Math.floor(Math.random() * 10 + 65)
  )}${String.fromCharCode(
    Math.floor(Math.random() * 10 + 65)
  )}${String.fromCharCode(
    Math.floor(Math.random() * 10 + 65)
  )}${String.fromCharCode(
    Math.floor(Math.random() * 10 + 65)
  )}${String.fromCharCode(
    Math.floor(Math.random() * 10 + 65)
  )}${String.fromCharCode(
    Math.floor(Math.random() * 10 + 65)
  )}${String.fromCharCode(
    Math.floor(Math.random() * 10 + 65)
  )}${String.fromCharCode(Math.floor(Math.random() * 10 + 65))}`;
  return id;
}

io.use((socket, next) => {
  const sessionID = socket.handshake.query.sessionID;
  console.log(socket.handshake.query);
  if (sessionID != "") {
    console.log("there is session id");

    Session.findOne({ sessionID }).then((session) => {
      if (session) {
        console.log(`session found: ${session.userID}`);

        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        console.log(socket);
        return next();
      }
    });
  } else {
    const username = socket.handshake.query.username;
    console.log(`The username is ${username}`);
    if (!username) {
      return next(new Error("Invalid Usernamee"));
    }
    socket.sessionID = randomID();
    socket.userID = randomID();
    socket.username = username;
    console.log(" session not found", sessionID);
    let thisSession = new Session({
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username,
    });
    thisSession.save().then((session) => console.log(session));
    next();
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
  });
  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
    User.findOne({ email: socket.username }).then((user) => {
      user.messages.push({
        from: "me",
        body: message,
      });
      user.save().then(console.log("message saved"));
    });
    /* … */
  });
  socket.on("admin message", ({ message, reciever }) => {
    console.log(`From admin ${message}`);
    socket.to(reciever).to(socket.userID).emit("admin message", {
      content,
      from: socket.userID,
      to: reciever,
    });
    console.log("reciever");
    // User.findOne({ email: socket.username }).then((user) => {
    //   user.messages.push({
    //     from: "me",
    //     body: message,
    //   });
    //   user.save().then(console.log("message saved"));
    // });
    /* … */
  });
  socket.on("disconnect", () => {
    /* … */
    console.log("user disconnected");
  });
});
server.listen(3000);

// app.get("/", (req, res) => {
//   res.send("hi");
// });
// app.get("/confirm", (req, res) => {
//   res.render("confirm-email");
// });
app.use("/", require("./routes/basics.js"));
app.use("/", require("./routes/users.js"));
app.use("/", require("./routes/verification.js"));
app.use("/about-us", require("./routes/about-us.js"));
app.use("/our-impact", require("./routes/our-impact.js"));
app.use("/solutions", require("./routes/solutions.js"));
app.use("/*", (req, res) => {
  res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("listening"));
