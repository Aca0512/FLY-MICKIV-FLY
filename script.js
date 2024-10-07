const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreBoard = document.getElementById('score-board');
const mickiv = document.getElementById('Mickiv'); // Element Mickiv

let birdTop = 250;
let gravity = 1.3;
let jumpHeight = 50;
let isGameOver = false;
let score = 0;
let pipeSpeed = 3;
let pipeFrequency = 1500;
let gameLoopInterval;

// Mencegah layar membesar saat touchmove
document.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

// Function to start the game
function startGame() {
    isGameOver = false;
    score = 0;
    pipeSpeed = 3;
    pipeFrequency = 1500; // Reset pipe frequency
    birdTop = 250;
    bird.style.top = `${birdTop}px`;
    bird.style.display = 'block'; // Show the bird

    // Show the score board and reset it
    scoreBoard.style.display = 'block'; // Show the score board
    scoreBoard.textContent = `Score: ${score}`;

    // Hide the Start button, Game Over screen, Mickiv, and Game Title
    startButton.style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    mickiv.style.display = 'none'; // Hide Mickiv when the game starts
    document.getElementById('game-title').style.display = 'none'; // Hide game title

    // Remove all existing pipes
    document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());

    // Start background scrolling animation
    gameContainer.style.animation = 'backgroundScroll 10s linear infinite'; // Ensure animation starts

    createPipe(); // Start creating pipes
    if (gameLoopInterval) {
        cancelAnimationFrame(gameLoopInterval); // Stop the existing loop if any
    }
    gameLoop();
}

// Function to run the game loop
function gameLoop() {
    if (isGameOver) return;

    birdTop += gravity;
    bird.style.top = `${birdTop}px`;

    document.querySelectorAll('.pipe').forEach(pipe => {
        let pipeLeft = parseInt(pipe.style.left);
        pipe.style.left = `${pipeLeft - pipeSpeed}px`;

        if (pipeLeft < 50 && !pipe.scored && pipe.classList.contains('pipe-top')) {
            increaseScore();
            pipe.scored = true; // Mark pipe as passed
        }

        if (pipeLeft < -60) {
            pipe.remove();
        }

        if (collisionDetection(pipe)) {
            gameOver();
        }
    });

    if (birdTop < 0 || birdTop > gameContainer.offsetHeight - bird.offsetHeight) {
        gameOver();
    }

    gameLoopInterval = requestAnimationFrame(gameLoop);
}

// Function to create a new pipe
function createPipe() {
    if (isGameOver) return;

    let pipeTopHeight = Math.random() * 200 + 50;
    let pipeBottomHeight = 600 - pipeTopHeight - 150;

    let pipeTop = document.createElement('div');
    pipeTop.classList.add('pipe', 'pipe-top');
    pipeTop.style.height = `${pipeTopHeight}px`;
    pipeTop.style.left = `${gameContainer.offsetWidth}px`; // Pipe appears from the right edge
    pipeTop.scored = false;

    let pipeBottom = document.createElement('div');
    pipeBottom.classList.add('pipe', 'pipe-bottom');
    pipeBottom.style.height = `${pipeBottomHeight}px`;
    pipeBottom.style.left = `${gameContainer.offsetWidth}px`; // Pipe appears from the right edge

    gameContainer.appendChild(pipeTop);
    gameContainer.appendChild(pipeBottom);

    setTimeout(createPipe, pipeFrequency);

    // Gradually increase difficulty
    pipeFrequency = Math.max(1000, pipeFrequency - 50);
    pipeSpeed = Math.min(10, pipeSpeed + 0.1);
}

// Function to increase score
function increaseScore() {
    score++;
    scoreBoard.textContent = `Score: ${score}`;
}

// Function to detect collision
// Function to detect collision with optional padding (negative value to get closer before collision)
function collisionDetection(pipe) {
    let pipeRect = pipe.getBoundingClientRect();
    let pipeTop = pipe.getBoundingClientRect();
    let birdRect = bird.getBoundingClientRect();

    // Adjust the bird's bounding rectangle by the padding value to make collision detection stricter
    const padding = 38; // Sesuaikan nilai ini agar tabrakan lebih dekat
    
    birdRect = {
        top: birdRect.top + padding,
        bottom: birdRect.bottom - padding,
        left: birdRect.left + padding,
        right: birdRect.right - padding
    };

    return !(
        birdRect.top > pipeRect.bottom ||
        birdRect.bottom < pipeRect.top ||
        birdRect.right < pipeRect.left ||
        birdRect.left > pipeRect.right
    );
}

// Function to end the game
function gameOver() {
    isGameOver = true;
    bird.style.display = 'none'; // Hide the bird
    document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());

    // Keep background scroll running during game over

    // Show the Game Over screen
    const gameOverScreen = document.getElementById('game-over-screen');
    const finalScore = document.getElementById('final-score');
    finalScore.textContent = `Final Score: ${score}`;
    gameOverScreen.style.display = 'block';

    // Hide the score board when the game is over
    scoreBoard.style.display = 'none';
}

// Event listener for Start button
startButton.addEventListener('click', () => {
    startGame(); // Start the game
});

// Event listener for Restart button
restartButton.addEventListener('click', () => {
    // Go back to the initial screen with Start button
    bird.style.display = 'none';
    scoreBoard.textContent = `Score: 0`;
    document.getElementById('game-over-screen').style.display = 'none';
    startButton.style.display = 'block'; // Show the Start button

    // Show Mickiv and Game Title on restart
    mickiv.style.display = 'block';
    document.getElementById('game-title').style.display = 'block'; // Show game title
});

// Control bird jump
document.addEventListener('keydown', () => {
    if (isGameOver) return;
    birdTop -= jumpHeight;
});

// Initialize game container styles
document.addEventListener('DOMContentLoaded', function() {
    gameContainer.style.backgroundSize = 'cover';
    gameContainer.style.backgroundPosition = 'center';
    gameContainer.style.backgroundRepeat = 'no-repeat';
    
    // Show Mickiv initially on the start screen
    mickiv.style.display = 'block';
});

// Control bird jump on keydown (for desktop)
document.addEventListener('keydown', () => {
    if (isGameOver) return;
    birdTop -= jumpHeight;
});

// Control bird jump on touchstart (for mobile and tablet)
document.addEventListener('touchstart', () => {
    if (isGameOver) return;
    birdTop -= jumpHeight;
});
