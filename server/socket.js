let onlineUsers = new Map();

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New Connection", socket.id);

    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User logged in", userId);

      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("send-msg", (data) => {
      const sendToSocketId = onlineUsers.get(data.to);
      if (sendToSocketId) {
        io.to(sendToSocketId).emit("msg-receive", {
          from: data.from,
          text: data.text,
        });
      }
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value == socket.id) {
          onlineUsers.delete(key);
          break;
        }
      }
      console.log("Disconnected", socket.id);

      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("typing", ({ to }) => {
      const sendToSocketId = onlineUsers.get(to);
      if (sendToSocketId) {
        io.to(sendToSocketId).emit("typing");
      }
    });

    socket.on("stop-typing", ({ to }) => {
      const sendToSocketId = onlineUsers.get(to);
      if (sendToSocketId) {
        io.to(sendToSocketId).emit("stop-typing");
      }
    });
  });
};

module.exports = { initSocket };
