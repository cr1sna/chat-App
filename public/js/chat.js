const socket = io();

//Element
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");

const $sendLocation = document.querySelector("#send-location");

socket.on("message", message => {
  console.log(message);
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
    $sendLocation.removeAttribute("disabled", "disabled");
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
