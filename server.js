const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const players = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Add a new player
  players[socket.id] = {
    x: Math.floor(Math.random() * 500),
    y: Math.floor(Math.random() * 500),
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
  };

  // Broadcast the new player to all other connected clients
  io.emit('newPlayer', players[socket.id]);

  // Handle player movement
  socket.on('playerMove', (data) => {
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
    io.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
  });

  // Handle player disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    io.emit('playerLeft', socket.id);
    delete players[socket.id];
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});