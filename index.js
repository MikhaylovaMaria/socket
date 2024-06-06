const io = require("socket.io")(8800, {
  cors: {
    origin: "https://pets-one-eta.vercel.app/",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // добавить пользователя
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    // console.log("Connected User", activeUsers);
    io.emit("get-users", activeUsers);
  });

  // отправка сообщения

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    // console.log("Sending from socket to: ", receiverId);
    // console.log("Data", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
      //   console.log("fkkfk");
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User disconected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});
