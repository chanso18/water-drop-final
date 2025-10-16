// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let countdownTimer; // Will store our countdown interval
let timeLeft = 30; // Countdown starts at 30 seconds
let score = 0;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  timeLeft = 30;
  document.getElementById("time").textContent = timeLeft;
  startCountdown();

  score = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("game-over-popup").style.display = "none";

  // Create new drops every 0.5 seconds (500 milliseconds)
  dropMaker = setInterval(createDrop, 500);
}

function startCountdown() {
  countdownTimer = setInterval(() => {
    if (!gameRunning) {
      clearInterval(countdownTimer);
      return;
    }
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(countdownTimer);
  // Show game over popup
  document.getElementById("final-score").textContent = score;
  document.getElementById("game-over-popup").style.display = "flex";
}
function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");

  // 20% chance to be a bad drop
  const isBadDrop = Math.random() < 0.2;
  if (isBadDrop) {
    drop.className = "water-drop bad-drop";
  } else {
    drop.className = "water-drop";
  }

  // Make drops different sizes for visual variety
  const initialSize = 40; // Increased from 60
  const sizeMultiplier = Math.random() * 0.8 + 0.8; // Minimum 80% of initialSize, max 160%
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract size to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - size);
  drop.style.left = xPosition + "px";

  // Make drops fall for a random duration between 4s (fastest) and 8s (slowest)
  const minDuration = 4; // seconds
  const maxDuration = 8; // seconds
  const duration = Math.random() * (maxDuration - minDuration) + minDuration;
  drop.style.animationDuration = duration + "s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  // Add click event to update score
  drop.addEventListener("click", () => {
    if (gameRunning) {
      if (isBadDrop) {
        score--;
      } else {
        score++;
      }
      document.getElementById("score").textContent = score;
      drop.remove();
    }
  });
}
// Close popup event
document.getElementById("close-popup").addEventListener("click", function() {
  document.getElementById("game-over-popup").style.display = "none";
  resetGame();
});

function resetGame() {
  score = 0;
  timeLeft = 30;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = timeLeft;
}
