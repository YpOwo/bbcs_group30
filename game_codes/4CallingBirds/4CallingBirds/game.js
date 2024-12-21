const socket = io();
const welcomeScreen = document.getElementById('welcome-screen');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const gameArea = document.getElementById('game-area');
const timerDisplay = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const finalScoreDisplay = document.getElementById('final-score');
const backgroundMusic = document.getElementById('background-music');

let playerName = '';
let score = 0;
let currentQuestion = 0;
let timeLeft = 20;
let timer;

const questions = [
    {
        lyric: "Jingle bells, jingle bells, jingle all the ___",
        options: ["day", "way", "ray", "yay"],
        correct: 1
    },
    {
        lyric: "Deck the halls with boughs of ___",
        options: ["jolly", "molly", "holly", "rolly"],
        correct: 2
    },
    {
        lyric: "Silent night, ___ night",
        options: ["holly", "holy", "peaceful", "rolly"],
        correct: 1
    },
    {
        lyric: "Rudolph the red-nosed ___, had a very shiny nose",
        options: ["rain deer", "reindeer", "deer", "ranger"],
        correct: 1
    }
];

startGameButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        socket.emit('newPlayer', playerName);
        welcomeScreen.style.display = 'none';
        gameArea.style.display = 'block';
        startGame();
    }
});

function startGame() {
    displayQuestion();
    startTimer();
    backgroundMusic.play();
}

function displayQuestion() {
    if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        questionText.textContent = question.lyric;
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.classList.add('option');
            button.textContent = option;
            button.addEventListener('click', () => selectAnswer(index));
            optionsContainer.appendChild(button);
        });
    } else {
        endGame();
    }
}

function selectAnswer(index) {
    if (index === questions[currentQuestion].correct) {
        score++;
    }
    currentQuestion++;
    displayQuestion();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    gameArea.style.display = 'none';
    finalScoreDisplay.style.display = 'block';
    finalScoreDisplay.textContent = `Final Score: ${score} out of 4`;
    socket.emit('gameEnded', { playerName, score });
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

socket.on('updateLeaderboard', (leaderboard) => {
    // Update leaderboard display (you can add this feature later)
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

// Start playing music when the page loads
window.addEventListener('load', () => {
    backgroundMusic.volume = 0.5; // Set volume to 50%
});

