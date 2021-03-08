let bubble = document.querySelector(".livechat-bubble");
let livechat = document.querySelector(".livechat-cont");
let livecloseCloseBtn = document.querySelector(".livechat-cont header .close");
let upBtn = document.querySelector(".up-bubble");
let messageBox = document.querySelector(".livechat-entry-bar .message-box");
let sendMessage = document.querySelector(".livechat-entry-bar .button");
let messages = document.querySelector("livechat-body .livechat-messages");

messageBox.value = "Send a message";
messageBox.addEventListener("focus", () => {
  messageBox.value = "";
});
messageBox.addEventListener("blur", () => {
  messageBox.value =
    messageBox.value === "" ? "Send a message" : messageBox.value;
});

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
});

function createMessage(value, mine = true) {
  let message = document.createElement("div");
  message.classList.add("message");
  mine ? message.classList.add("left") : "";
  messages.appendChild(message);
}
