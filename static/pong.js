const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let paddle = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 20,
  width: 100,
  height: 10,
  dx: 7,
};

let ball = {
  x: canvas.width / 2,
  y: 100,
  radius: 10,
  dx: 3,
  dy: 3,
};

let score = 0;
let gameOver = false;

function drawPaddle() {
  ctx.fillStyle = '#F6C4C8';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#8C6180';
  ctx.fill();
  ctx.closePath();
}

function drawTopBar() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, 20);
}

function drawScore() {
  ctx.font = '20px Jura';
  ctx.fillStyle = '#8C6180';
  ctx.fillText(`Points: ${score}`, 10, 35);
}

function drawGameOver() {
  ctx.font = '36px Jura';
  ctx.fillStyle = '#8C6180';
  ctx.fillText('YOU LOSE', canvas.width / 2 - 90, canvas.height / 2 - 20);
  ctx.font = '24px Jura';
  ctx.fillText(`YOUR SCORE: ${score}`, canvas.width / 2 - 90, canvas.height / 2 + 20);
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTopBar();
  drawPaddle();
  drawBall();
  drawScore();

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }

  if (ball.y - ball.radius < 20) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.x >= paddle.x &&
    ball.x <= paddle.x + paddle.width
  ) {
    ball.dy *= -1;
    score += 10;
  }

  // Game over
  if (ball.y + ball.radius > canvas.height) {
    gameOver = true;
    drawGameOver();
    return;
  }

  requestAnimationFrame(update);
}

function keyDownHandler(e) {
  if (e.key === 'ArrowRight' && paddle.x + paddle.width < canvas.width) {
    paddle.x += paddle.dx;
  } else if (e.key === 'ArrowLeft' && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

document.addEventListener('keydown', keyDownHandler);

update();