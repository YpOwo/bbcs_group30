const socket = io();
const playerForm = document.getElementById('player-form');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const gameArea = document.getElementById('game-area');
const timerDisplay = document.getElementById('timer');
const attemptsDisplay = document.getElementById('attempts');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const stick = document.getElementById('stick');
const ring = document.getElementById('ring');
const christmasMusic = document.getElementById('christmas-music');

let playerName = '';
let score = 0;
let attempts = 5;
let gameActive = false;
let timeLeft = 5;
let stickDirection = 1;

startGameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        socket.emit('newPlayer', playerName);
        playerForm.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    }
});

function startGame() {
    gameActive = true;
    startTimer();
    moveStick();
    christmasMusic.play();
}

function startTimer() {
    const timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0 || attempts <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function moveStick() {
    let position = 50;
    const moveInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(moveInterval);
            return;
        }
        position += stickDirection;
        if (position >= 90 || position <= 10) {
            stickDirection *= -1;
        }
        stick.style.left = `${position}%`;
    }, 20);
}

function throwRing() {
    if (!gameActive || attempts <= 0) return;

    attempts--;
    attemptsDisplay.textContent = `Attempts: ${attempts}`;

    const ringRect = ring.getBoundingClientRect();
    const stickRect = stick.getBoundingClientRect();

    if (
        ringRect.left < stickRect.right &&
        ringRect.right > stickRect.left &&
        ringRect.bottom > stickRect.top
    ) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    if (attempts <= 0 || score >= 5) {
        endGame();
    }
}

function endGame() {
    gameActive = false;
    gameArea.style.display = 'none';
    finalScoreDisplay.style.display = 'block';
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    socket.emit('gameEnded', { playerName, score });
    christmasMusic.pause();
    christmasMusic.currentTime = 0;
}

ring.addEventListener('click', throwRing);

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

socket.on('updateLeaderboard', (leaderboard) => {
    // Update leaderboard display (you can add this feature later)
});

// Start playing music when the page loads
window.addEventListener('load', () => {
    christmasMusic.volume = 0.5; // Set volume to 50%
    christmasMusic.play().catch(error => {
        console.log("Audio play failed:", error);
    });
});

