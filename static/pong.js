const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  // Portrait aspect ratio 9:16
  const aspectRatio = 9 / 16;

  // Set a max height limit (e.g., 600px)
  const maxAllowedHeight = 600;

  // Start with width = window width
  let width = maxWidth;
  let height = width / aspectRatio;

  // If height is too big or exceeds maxAllowedHeight, adjust width & height
  if (height > maxHeight || height > maxAllowedHeight) {
    height = Math.min(maxHeight, maxAllowedHeight);
    width = height * aspectRatio;
  }

  canvas.width = width;
  canvas.height = height;

  paddleX = (canvas.width - paddleWidth) / 2;
  paddleY = canvas.height - paddleHeight - 10;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

window.addEventListener('resize', resizeCanvas);

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 15;
let paddleX = 0;
let paddleY = 0; // will be set in resizeCanvas

// Top bar properties
const topBarHeight = 40;

// Ball properties
const ballRadius = 10;
let ballX = 0;
let ballY = 0;
let ballSpeedX = 3;
let ballSpeedY = -3;

let score = 0;
let isGameOver = false;

// Keyboard control flags
let leftPressed = false;
let rightPressed = false;

// Touch dragging
let dragging = false;

// Animation frame controller
let animationFrameId = null;

function drawPaddle() {
  ctx.fillStyle = '#8C6180';
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawTopBar() {
  ctx.fillStyle = 'rgba(140, 97, 128, 0.8)';
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
  if (leftPressed) paddleX -= 7;
  if (rightPressed) paddleX += 7;
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
}

function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballY - ballRadius <= topBarHeight) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    ballY + ballRadius >= paddleY &&
    ballX >= paddleX &&
    ballX <= paddleX + paddleWidth
  ) {
    ballSpeedY = -ballSpeedY;
    score += 10;
  }

  if (ballY - ballRadius > canvas.height) {
    isGameOver = true;
  }
}

// Keyboard events
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
  if (dragging) movePaddleWithTouch(e);
  e.preventDefault();
});

canvas.addEventListener('touchend', () => {
  dragging = false;
});

function movePaddleWithTouch(e) {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  let touchX = touch.clientX - rect.left;
  paddleX = touchX - paddleWidth / 2;
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
}

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

function startGame() {
  resizeCanvas();
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 3;
  ballSpeedY = -3;
  score = 0;
  isGameOver = false;
  paddleX = (canvas.width - paddleWidth) / 2;
  if (!animationFrameId) draw();
}

function stopGame() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

window.startGame = startGame;
window.stopGame = stopGame;
window.draw = draw;

// Initial setup
resizeCanvas();
