const bodyParser = require("body-parser");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const PORT = 8080;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {});
const Session = require("./models/sessions");
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
dotenv.config();

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

    /* … */
  });
  socket.on("admin message", ({ message, reciever }) => {
    console.log(`From admin ${message}`);
    socket.to(reciever).to(socket.userID).emit("admin message", {
      content,
      from: socket.userID,
      to: reciever,
    });

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
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/faq", (req, res) => {
  res.render("faq");
});
app.get("/financials", (req, res) => {
  res.render("financials/financial");
});
app.get("/health-our-world-starts-access-safe-water", (req, res) => {
  res.render("health-our-world-starts-access-safe-water");
});
app.get("/financials/2019", (req, res) => {
  res.render("financials/2019");
});
app.get("/donate", (req, res) => {
  res.render("donate");
});
app.get("/invest", (req, res) => {
  res.render("invest");
});
app.get("/contact-us", (req, res) => {
  res.render("contact-us");
});
app.get("/our-vision", (req, res) => {
  res.render("our-vision");
});
app.get("/monthly-giving", (req, res) => {
  res.render("monthly-giving");
});
app.get("/partners", (req, res) => {
  res.render("partners");
});

app.get("/careers", (req, res) => {
  res.render("careers");
});
app.get("/news-press", (req, res) => {
  res.render("news-press");
});
app.get("/resources", (req, res) => {
  res.render("resources");
});
app.get("/subscribe", (req, res) => {
  res.render("subscribe");
});
// app.get("/confirm", (req, res) => {
//   res.render("confirm-email");
// });
app.use("/", require("./routes/users.js"));
app.use("/", require("./routes/verification.js"));
app.use("/about-us", require("./routes/about-us.js"));
app.use("/our-impact", require("./routes/our-impact.js"));
app.use("/solutions", require("./routes/solutions.js"));

app.listen(PORT, () => console.log("listening"));
