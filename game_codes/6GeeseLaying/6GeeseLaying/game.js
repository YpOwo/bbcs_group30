const socket = io();
const playerForm = document.getElementById('player-form');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const gameArea = document.getElementById('game-area');
const egg = document.getElementById('egg');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');

let playerName = '';
let score = 0;
let gameActive = false;
let timeLeft = 3;
let eggSize = 100;

startGameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        socket.emit('newPlayer', playerName);
        playerForm.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    }
});

socket.on('updateGame', (gameState) => {
    eggSize = gameState.eggSize;
    updateEggSize();
});

function startGame() {
    gameActive = true;
    startTimer();
}

function updateEggSize() {
    egg.style.width = `${eggSize}px`;
    egg.style.height = `${eggSize}px`;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function startTimer() {
    const timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    gameArea.style.display = 'none';
    finalScoreDisplay.style.display = 'block';
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    socket.emit('gameEnded', { playerName, score });
}

egg.addEventListener('click', () => {
    if (gameActive) {
        score++;
        updateScore();
        socket.emit('eggClicked', { playerName, score });
    }
});

// Add snowflakes
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

setInterval(createSnowflake, 200);

