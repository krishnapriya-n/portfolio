const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 15;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleY = canvas.height - paddleHeight - 10; // fixed bottom paddle position

// Top bar properties
const topBarHeight = 40;

// Ball properties
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = -3;

let score = 0;
let isGameOver = false;

// Keyboard control flags
let leftPressed = false;
let rightPressed = false;

// Touch dragging
let dragging = false;

// For controlling animation frame loop externally
let animationFrameId = null;

function drawPaddle() {
  ctx.fillStyle = '#8C6180';
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawTopBar() {
  ctx.fillStyle = 'rgba(140, 97, 128, 0.8)'; // opaque bar
  ctx.fillRect(0, 0, canvas.width, topBarHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = '#8C6180';
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.fillStyle = '#8C6180';
  ctx.font = '20px Jura, monospace';
  ctx.fillText(`Points: ${score}`, 10, 30);
}

function drawGameOver() {
  ctx.fillStyle = '#8C6180';
  ctx.font = '40px Jura, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('YOU LOSE', canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '30px Jura, monospace';
  ctx.fillText(`YOUR SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
}

function updatePaddle() {
  if (leftPressed) {
    paddleX -= 7;
  }
  if (rightPressed) {
    paddleX += 7;
  }
  // Clamp paddle within canvas
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
}

function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce off left and right walls
  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    ballSpeedX = -ballSpeedX;
  }

  // Bounce off top bar
  if (ballY - ballRadius <= topBarHeight) {
    ballSpeedY = -ballSpeedY;
  }

  // Bounce off paddle
  if (
    ballY + ballRadius >= paddleY &&
    ballX >= paddleX &&
    ballX <= paddleX + paddleWidth
  ) {
    ballSpeedY = -ballSpeedY;
    score += 10;
  }

  // Check if ball missed paddle (goes below bottom)
  if (ballY - ballRadius > canvas.height) {
    isGameOver = true;
  }
}

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = true;
  if (e.key === 'ArrowRight') rightPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') leftPressed = false;
  if (e.key === 'ArrowRight') rightPressed = false;
});

// Touch controls
canvas.addEventListener('touchstart', (e) => {
  dragging = true;
  movePaddleWithTouch(e);
});

canvas.addEventListener('touchmove', (e) => {
  if (dragging) {
    movePaddleWithTouch(e);
  }
  e.preventDefault(); // prevent scrolling while touching canvas
});

canvas.addEventListener('touchend', () => {
  dragging = false;
});

function movePaddleWithTouch(e) {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  let touchX = touch.clientX - rect.left;

  // Center paddle on touch X, clamp within canvas
  paddleX = touchX - paddleWidth / 2;
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
}

// Main game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTopBar();
  drawPaddle();
  drawBall();
  drawScore();

  if (isGameOver) {
    drawGameOver();
  } else {
    updatePaddle();
    updateBall();
    animationFrameId = requestAnimationFrame(draw);
  }
}

// Functions to start/stop game externally (for sidebar open/close)
function startGame() {
  // Reset game if over
  if (isGameOver) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 3;
    ballSpeedY = -3;
    score = 0;
    isGameOver = false;
    paddleX = (canvas.width - paddleWidth) / 2;
  }
  if (!animationFrameId) {
    draw();
  }
}

function stopGame() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// Expose startGame and stopGame globally for sidebar control
window.startGame = startGame;
window.stopGame = stopGame;
window.draw = draw; // in case you want to manually call draw

// Start game automatically if you want
// draw();
