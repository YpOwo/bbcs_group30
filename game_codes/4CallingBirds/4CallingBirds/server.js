const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, '.')));

const players = {};
const leaderboard = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newPlayer', (playerName) => {
        players[socket.id] = { name: playerName, score: 0 };
    });

    socket.on('gameEnded', ({ playerName, score }) => {
        console.log(`${playerName} finished with score: ${score}`);
        updateLeaderboard(playerName, score);
        io.emit('updateLeaderboard', leaderboard);
        delete players[socket.id];
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete players[socket.id];
    });
});

function updateLeaderboard(playerName, score) {
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 10) {
        leaderboard.pop();
    }
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

