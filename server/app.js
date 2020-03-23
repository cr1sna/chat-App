const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  generateMessage,
  generatelocationMessaage
} = require("./utlis/messages");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicPath));

// server emit an event and client recieve an event in this case event is countUpdated
// client emit an event and server recieve an event in this case event is increment

io.on("connection", socket => {
  socket.emit("message", generateMessage("Welcome!"));
  socket.broadcast.emit("message", generateMessage("User has join the group"));

  socket.on("sendMessage", (message, callback) => {
    // socket.emit("countUpdated", count)--> emit to only single connection.
    io.emit("message", generateMessage(message));
    callback("Delivered."); // --> emit to every single connection
  });

  socket.on("location", (coords, callback) => {
    io.emit(
      "sendLocation",
      generatelocationMessaage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    ),
      callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user leaves group"));
  });
});

server.listen(port, () => {
  console.log("server is up on port", port);
});
