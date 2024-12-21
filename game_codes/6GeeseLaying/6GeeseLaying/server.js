const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, '.')));

const players = {};
let eggSize = 100;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('newPlayer', (playerName) => {
        players[socket.id] = { name: playerName, score: 0 };
        io.emit('updateGame', { eggSize });
    });

    socket.on('eggClicked', ({ playerName, score }) => {
        players[socket.id].score = score;
        eggSize += 2;
        io.emit('updateGame', { eggSize });
    });

    socket.on('gameEnded', ({ playerName, score }) => {
        console.log(`${playerName} finished with score: ${score}`);
        delete players[socket.id];
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        delete players[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

