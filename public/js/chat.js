const socket = io();

//Element
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $messages = document.querySelector("#messages");
const $sendLocation = document.querySelector("#send-location");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-message-template")
  .innerHTML;

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
console.log(username);

socket.on("sendLocation", url => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    url: url.text,
    dateCreated: moment(url.dateCreated).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("message", message => {
  console.log(message.text);
  console.log(message.username);

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    dateCreated: moment(message.dateCreated).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html);
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
    location.href("/");
  }
});
