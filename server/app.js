const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  generateMessage,
  generatelocationMessaage
} = require("./utlis/messages");

const {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser
} = require("./utlis/users");

const publicPath = path.join(__dirname, "/../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicPath));

// server emit an event and client recieve an event in this case event is countUpdated
// client emit an event and server recieve an event in this case event is increment

io.on("connection", socket => {
  socket.on("join", ({ username, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage(user.username, "Welcome!"));

    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has join the group`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      user_room: getUsersInRoom(user.room)
    });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    console.log(user);
    // socket.emit("countUpdated", count)--> emit to only single connection.
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback("Delivered."); // --> emit to every single connection
  });

  socket.on("location", (coords, callback) => {
    const user = getUser(socket.id);
    io
      .to(user.room)
      .emit(
        "sendLocation",
        generatelocationMessaage(
          user.username,
          `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        )
      ),
      callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username}  leaves a group`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});
server.listen(port, () => {
  console.log("server is up on port", port);
});
