const socket = io();

//Element
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
const $sendLocation = document.querySelector("#send-location");
const $sidebar = document.querySelector("#side-bar");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-message-template")
  .innerHTML;
const chatSidebarTemplate = document.querySelector("#sidebar-template")
  .innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoscroll = () => {
  //New Message Element
  const $newMessage = $messages.lastElementChild;
  // Height of the new Message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
  //Visible Height
  const VisibleHeight = $messages.offsetHeight;
  //total height of container
  const containerHeight = $messages.scrollHeight;
  //How far have i scrolled ?
  const scrolledoffset = $messages.scrollTop + VisibleHeight;

  if (containerHeight - newMessageHeight <= scrolledoffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("roomData", ({ room, user_room }) => {
  const html = Mustache.render(chatSidebarTemplate, {
    room,
    user_room
  });
  $sidebar.innerHTML = html;
});

socket.on("sendLocation", url => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    url: url.text,
    dateCreated: moment(url.dateCreated).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("message", message => {
  // console.log(message.text);
  // console.log(message.username);

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    dateCreated: moment(message.dateCreated).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }
    console.log("Message Delivered!!!");
  });
});

$sendLocation.addEventListener("click", () => {
  $sendLocation.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    $sendLocation.removeAttribute("disabled");
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      error => {
        $sendLocation.removeAttribute("disabled");

        if (error) {
          return console.log(error);
        }
        console.log("location was shared successfully !!!");
      }
    );
  });
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
