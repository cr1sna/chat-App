const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicPath));

welcomeMessage = "Welcome to the Group";
leaveMessage = "User has leave the Group";
// server emit an event and client recieve an event in this case event is countUpdated
// client emit an event and server recieve an event in this case event is increment

io.on("connection", socket => {
  socket.emit("message", welcomeMessage);
  socket.broadcast.emit("message", "A new user has joined");

  socket.on("sendMessage", message => {
    // socket.emit("countUpdated", count)--> emit to only single connection.
    io.emit("message", message); // --> emit to every single connection
  });

  socket.on("message", coords => {
    io.emit(
      "message",
      `logitude: ${coords.logitude} latitude: ${coords.latitude}`
    );
  });

  socket.on("disconnect", () => {
    io.emit("message", leaveMessage);
  });
});

server.listen(port, () => {
  console.log("server is up on port", port);
});
