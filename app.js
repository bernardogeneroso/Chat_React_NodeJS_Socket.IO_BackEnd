const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

var messages = [];

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.emit("messagesStart", messages);

  socket.on("messageToServer", (data) => {
    messages.push(data);
    socket.broadcast.emit("newMessage", data);
    console.log(messages);
  });

  socket.on("removeMessage", (data) => {
    messages = data;
    socket.broadcast.emit("messagesRender", messages);
    console.log(messages);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
