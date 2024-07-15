const socket = io();

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const players = {};

socket.on('newPlayer', (player) => {
  players[player.id] = player;
});

socket.on('playerMoved', (player) => {
  players[player.id].x = player.x;
  players[player.id].y = player.y;
});

socket.on('playerLeft', (playerId) => {
  delete players[playerId];
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const playerId in players) {
    const player = players[playerId];
    ctx.beginPath();
    ctx.arc(player.x, player.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener('mousemove', (event) => {
  socket.emit('playerMove', {
    x: event.clientX - canvas.offsetLeft,
    y: event.clientY - canvas.offsetTop
  });
});

gameLoop();