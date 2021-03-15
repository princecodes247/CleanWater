let bubble = document.querySelector(".livechat-bubble");
let livechat = document.querySelector(".livechat-cont");
let livecloseCloseBtn = document.querySelector(".livechat-cont header .close");
let upBtn = document.querySelector(".up-bubble");
let messageBox = document.querySelector(".livechat-entry-bar .message-box");

let sendMessage = document.querySelector(".livechat-entry-bar .button");
let messages = document.querySelector(".livechat-body .livechat-messages");

// messageBoxBefore.style.display = "block";
// messageBox.addEventListener("focus", () => {
//   messageBoxBefore.style.display = "none";
// });
// messageBox.addEventListener("blur", () => {
//   messageBoxBefore.style.display = messageBox.value === "" ? "block" : "none";
// });

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
  createMessage(messageBox.value);
  messageBox.value = "Send a Message";
});

function createMessage(value, mine = true) {
  let message = document.createElement("div");
  message.classList.add("message");
  mine ? message.classList.add("left") : "";
  message.innerText = value;
  messages.appendChild(message);
}
