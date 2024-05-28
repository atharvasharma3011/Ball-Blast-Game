var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var score = 0; 
var scoreDisplay = document.getElementById("scoreDisplay");
var currentLevel = 1; 
var missCount = 0;
var missDisplay = document.getElementById("missDisplay");
var percentageDisplay = document.getElementById("percentageDisplay");
var startButton = document.getElementById("startButton");
var stopButton = document.getElementById("stopButton");
var resetButton = document.getElementById("resetButton");
var timerInterval;
var seconds = 0;
var timerDisplay = document.getElementById("timerDisplay");
var gameRunning = true;

window.onload = function() {
  document.addEventListener("contextmenu", function(e) {      // right click disable 
      e.preventDefault();
  });
};



var redBall = {
  x: 0,
  y: 0,
  radius: 0,
  speed: 0,
  dx: 0,
  dy: 0,
  color: "#ff7223",
};

var blackBall = {
  x: 0,
  y: 0,
  radius: 0,
  speed: 0,
  dx: 1,
  dy: 0,
  color: "white",
};

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(function () {
    seconds++;
    displayTimer();
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Function to reset the timer
function resetTimer() {
  stopTimer();
  seconds = 0;
  displayTimer();
}

// Function to display the timer
function displayTimer() {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  timerDisplay.textContent =
    "Time: " +
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (remainingSeconds < 10 ? "0" : "") +
    remainingSeconds;
}

// Function to start the game
function startGame() {
  if (!gameRunning) {
    gameRunning = true;
    startTimer();
    update();
  }
  displayTimer();
  
  startButton.style.display = "none"; // Hide the start button
  stopButton.classList.remove("d-none"); // Hide the stop button
  canvas.style.display = "block"; // Show the canvas
  levelButtons.style.display = "block"; // Show the level buttons

}

// Function to restart the game
function resetGame() {
  resetTimer();
  startTimer();
  score = 0;
  missCount = 0;
  startButton.style.display = "none"; // Show the start button
  canvas.style.display = "block"; // Hide the canvas
  levelButtons.style.display = "none"; // Hide the level buttons
  resetButton.style.display = "none"; // Hide the reset button
}

// Function to start a specific level
function startLevel(level) {
  gameRunning = false;
  resetTimer();
  score = 0;
  missCount = 0;
  currentLevel = level; // Update current level
  var buttons = document.querySelectorAll('.level-button');
  buttons.forEach(function (button) {
    button.style.backgroundColor = '#4c356b'; // Reset to original color
  });

  // Get the clicked button and change its background color to orange
  var clickedButton = document.querySelector('.level-button[data-level="' + level + '"]');
  clickedButton.style.backgroundColor = '#ff7223';

  switch (level) {
    case 1:
      setLevelParameters(25, 25, 0);
      break;
    case 2:
      setLevelParameters(20, 20, 0);
      break;
    case 3:
      setLevelParameters(25, 25, 3);
      break;
    case 4:
      setLevelParameters(20, 20, 3);
      break;
    case 5:
      setLevelParameters(25, 25, 6);
      break;
    case 6:
      setLevelParameters(20, 20, 6);
      break;
    case 7:
      setLevelParameters(25, 25, 3);
      break;
    case 8:
      setLevelParameters(20, 20, 3);
      break;
    case 9:
      setLevelParameters(25, 25, 6);
      break;
    case 10:
      setLevelParameters(20, 20, 6);
      break;
  }
  displayWindowDimensions();

}
update();

// Function to set parameters for the red and black balls based on the selected level
function setLevelParameters(redRadius, blackRadius, bS) {
  redBall.radius = redRadius;
  redBall.speed = 5; // Red ball speed is constant for all levels
  blackBall.radius = blackRadius; // Black ball radius is constant for all levels
  blackBall.speed = bS;
}

// Function to get window dimensions
function getWindowDimensions() {
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  return { width: width, height: height };
}

// Function to display window dimensions and initialize ball positions
function displayWindowDimensions() {
  var dimensions = getWindowDimensions();
  var minDimension = Math.min(dimensions.width, dimensions.height);
  redBall.x = minDimension / 2;
  redBall.y = minDimension / 2;

  canvas.width = minDimension / 1.2;
  canvas.height = minDimension / 1.2;
}

// Function to draw red and black balls on the canvas
function drawBalls() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw red ball
  ctx.beginPath();
  ctx.arc(redBall.x, redBall.y, redBall.radius, 0, Math.PI * 2);
  ctx.fillStyle = redBall.color;
  ctx.fill();
  ctx.closePath();
  // Draw black ball
  ctx.beginPath();
  ctx.arc(blackBall.x, blackBall.y, blackBall.radius, 0, Math.PI * 2);
  ctx.fillStyle = blackBall.color;
  ctx.fill();
  ctx.closePath();
  //display score
  scoreDisplay.textContent = "Hit: " + score;
  //display miss
  missDisplay.textContent = "Miss: " + missCount;
  //Calculate PErcentage
  var percentage = calculatePercentage(score, missCount);
  percentageDisplay.textContent = "Score: " + percentage + "%";
}

function calculatePercentage(score, missCount) {
  var total = score + missCount;
  if (total === 0) {
    return 0;
  } else {
    return Math.round((score / total) * 100);
  }
}

// Function to move the red ball
function moveRedBall() {
  var nextX = redBall.x + redBall.dx * redBall.speed;
  var nextY = redBall.y + redBall.dy * redBall.speed;

  // Calculate distance from center of the canvas
  var distanceFromCenter = Math.sqrt(
    Math.pow(nextX - canvas.width / 2, 2) +
    Math.pow(nextY - canvas.height / 2, 2)
  );

  // Check if the next position of the red ball is within the circular canvas
  if (distanceFromCenter + redBall.radius <= canvas.width / 2) {
    redBall.x = nextX;
    redBall.y = nextY;
  }
}

// Function to move the black ball
function moveBlackBall() {
  if (!gameRunning) return;
  switch (currentLevel) {
    case 1:
    case 2:
      var nextX = blackBall.x + blackBall.dx * blackBall.speed;
      var nextY = blackBall.y + blackBall.dy * blackBall.speed;

      // Calculate distance from center of the canvas
      var distanceFromCenter = Math.sqrt(
        Math.pow(nextX - canvas.width / 2, 2) +
        Math.pow(nextY - canvas.height / 2, 2)
      );

      // Check if the next position of the black ball is within the circular canvas
      if (distanceFromCenter + blackBall.radius <= canvas.width / 2) {
        blackBall.x = nextX;
        blackBall.y = nextY;
      } else {
        // If the black ball moves out of bounds, reset its position
        resetBlackBallPosition(canvas.width / 2 - blackBall.radius);
      }
      break;
    case 3:
    case 4:
    case 5:
    case 6:
      blackBall.x += blackBall.dx * blackBall.speed;
      blackBall.y += blackBall.dy * blackBall.speed;

      // If the black ball goes out of bounds, reset its position and increase miss count
      if (
        blackBall.x + blackBall.radius < 0 ||
        blackBall.x - blackBall.radius > canvas.width ||
        blackBall.y + blackBall.radius < 20 ||
        blackBall.y - blackBall.radius > canvas.height
      ) {
        resetBlackBallPosition(canvas.width);
        missCount++;
      }
      break;
    case 7:
    case 8:
    case 9:
    case 10:
      blackBall.x += blackBall.dx * blackBall.speed;
      blackBall.y += blackBall.dy * blackBall.speed;

      // If the black ball goes out of bounds, reset its position
      if (
        blackBall.x + blackBall.radius < 0 ||
        blackBall.x - blackBall.radius > canvas.width ||
        blackBall.y + blackBall.radius < 0 ||
        blackBall.y - blackBall.radius > canvas.height
      ) {
        resetBlackBallPosition(canvas.width);
        missCount++;
      }
      break;
  }
}

// Function to reset the position of the black ball when it goes out of bounds
function resetBlackBallPosition(canvasSize) {
  var distanceFromBorder = 100; // Distance from the canvas border
  var position =
    Math.random() * (canvasSize - 2 * distanceFromBorder) + distanceFromBorder;

  switch (currentLevel) {
    case 1:
    case 2:
      var angle = Math.random() * Math.PI * 2; // Generate a random angle
      var minDistanceFromCenter = 80 + blackBall.radius; // Minimum distance from redball
      var maxDistanceFromCenter = canvasSize / 2 - blackBall.radius; // Maximum distance from center within canvas bounds

      // Generate a random distance from center within allowed bounds
      var distanceFromCenter =
        Math.random() * (maxDistanceFromCenter - minDistanceFromCenter) +
        minDistanceFromCenter;

      // Calculate the new position of the black ball
      blackBall.x = canvas.width / 2 + Math.cos(angle) * distanceFromCenter;
      blackBall.y = canvas.height / 2 + Math.sin(angle) * distanceFromCenter;
      break;
    case 3:
    case 4:
    case 5:
    case 6:
      var distanceFromBorder = 100; // Distance from the canvas border
      var position =
        Math.random() * (canvasSize - 2 * distanceFromBorder) +
        distanceFromBorder;
      blackBall.x =
        Math.random() < 0.5 ? canvasSize - blackBall.radius : blackBall.radius;
      blackBall.y = position;
      blackBall.dx = blackBall.x === canvasSize - blackBall.radius ? -1 : 1;
      blackBall.dy = 0;
      break;
    case 7:
    case 8:
    case 9:
    case 10:
      var distanceFromBorder = 100; // Distance from the canvas border
      var position =
        Math.random() * (canvasSize - 2 * distanceFromBorder) + distanceFromBorder;
      var axis = Math.floor(Math.random() * 4); // 0: top, 1: bottom, 2: left, 3: right

      switch (axis) {
        case 0: // Top
          blackBall.x = position;
          blackBall.y = blackBall.radius;
          blackBall.dx = 0;
          blackBall.dy = 1;
          break;
        case 1: // Bottom
          blackBall.x = position;
          blackBall.y = canvasSize - blackBall.radius;
          blackBall.dx = 0;
          blackBall.dy = -1;
          break;
        case 2: // Left
          blackBall.x = blackBall.radius;
          blackBall.y = position;
          blackBall.dx = 1;
          blackBall.dy = 0;
          break;
        case 3: // Right
          blackBall.x = canvasSize - blackBall.radius;
          blackBall.y = position;
          blackBall.dx = -1;
          blackBall.dy = 0;
          break;
      }
      break;
  }
}
// Add event listeners for W, A, S, D key presses to set red ball direction
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "w":
      redBall.dy = -1;
      break;
    case "s":
      redBall.dy = 1;
      break;
    case "a":
      redBall.dx = -1;
      break;
    case "d":
      redBall.dx = 1;
      break;
  }
});

// Add event listeners for W, A, S, D key releases to stop red ball movement
window.addEventListener("keyup", function (event) {
  switch (event.key) {
    case "w":
    case "s":
      redBall.dy = 0;
      break;
    case "a":
    case "d":
      redBall.dx = 0;
      break;
  }
});

// Function to update the game state
function update() {
  moveRedBall();
  moveBlackBall();
  drawBalls();
  // Check for collision between red and black balls
  if (checkCollision(redBall, blackBall)) {
    resetBlackBallPosition(canvas.width);
    score++; // Increase score on collision
  }

  if (gameRunning) {
    requestAnimationFrame(update);
  }
}

// Function to check collision between two balls
function checkCollision(ball1, ball2) {
  var dx = ball1.x - ball2.x;
  var dy = ball1.y - ball2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  return distance < ball1.radius + ball2.radius;
}

gameRunning = true;

stopButton.addEventListener('click', function () {
  var button = document.getElementById("stopButton");
  button.style.backgroundColor = '#ff7223';
  gameRunning = !gameRunning;
  stopTimer();
  if (gameRunning) {
    update();
    startTimer();
    var button = document.getElementById("stopButton");
    button.style.backgroundColor = '#4c356b';
  }
})