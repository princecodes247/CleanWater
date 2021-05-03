let bubble = document.querySelector(".livechat-bubble");
let livechat = document.querySelector(".livechat-cont");
let livecloseCloseBtn = document.querySelector(".livechat-cont header .close");
let upBtn = document.querySelector(".up-bubble");
let messageBox = document.querySelector(".livechat-entry-bar .message-box");

let sendMessage = document.querySelector(".livechat-entry-bar .button");
let messages = document.querySelector(".livechat-body .livechat-messages");

const sessionID = localStorage.getItem("sessionID");
console.log(sessionID);
socket = io("http://localhost:3000/", {
  query: {
    // The IP addres would be thhhe username
    username: "princer",
    sessionID: `${sessionID === null ? "" : sessionID}`,
  },
  autoConnect: false,
});

console.log(socket.query);
socket.connect();

socket.on("connect", function () {});
socket.on("session", ({ sessionID, userID, username }) => {
  console.log(sessionID, userID, username);
  socket.auth = { sessionID };

  //store it in local storage
  localStorage.setItem("sessionID", sessionID);

  socket.userID = userID;
});
socket.on("message", (message, admin) => {
  createMessage(message, !admin);
});
socket.on("disconnect", function () {});

bubble.addEventListener("click", () => {
  livechat.classList.toggle("close");
});

upBtn.addEventListener("click", () => {
  $("html, body").animate(
    {
      scrollTop: 0,
    },
    "slow"
  );
});

livecloseCloseBtn.addEventListener("click", () => {
  livechat.classList.toggle("close");
});

sendMessage.addEventListener("click", () => {
  socket.emit("message", messageBox.value);

  messageBox.value = "Send a Message";
});

function createMessage(value, mine = true) {
  let message = document.createElement("div");
  message.classList.add("message");
  mine ? message.classList.add("left") : "";
  message.innerText = value;
  messages.appendChild(message);
}
