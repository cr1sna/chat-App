const users = [];

//addUser, removeUser , getUser , getUsersInRoom
const addUser = ({ id, username, room }) => {
  //Cleaning the data
  username = username.trim();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Please enter the username and room both!"
    };
  }
  const checkUser = users.find(user => {
    return user.username === username && user.room === room;
  });

  if (checkUser) {
    return {
      error: "User already Exits!!!"
    };
  }

  user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => {
    return user.id === id;
  });

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  const index = users.findIndex(user => {
    return user.id === id;
  });

  if (index != -1) {
    return users[index];
  }
};

const getUsersInRoom = room => {
  return users.filter(user => user.room === room);
};
// addUser({ id: 12, username: "Prativa", room: "girlfriend" });
// addUser({ id: 12, username: "Susmita", room: "girlfriend" });
// addUser({ id: 12, username: "Susmita", room: "friend" });
// console.log(getUsersInRoom("girlfriend"));

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser
};
