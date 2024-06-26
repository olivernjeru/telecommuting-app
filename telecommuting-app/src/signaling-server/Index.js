const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', socket.id);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', socket.id);
    });

    socket.on('signal', (data) => {
      socket.to(roomId).emit('signal', data);
    });
  });
});

server.listen(3001, () => {
  console.log('Signaling server is running on port 3001');
});
