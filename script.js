// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let gamePaused = false; // Keeps track of whether game is paused
let dropMaker; // Will store our timer that creates drops regularly
let countdownTimer; // Will store our countdown interval
let timeLeft = 30; // Countdown starts at 30 seconds
let score = 0;

// Difficulty settings
let difficultySettings = {
  easy: {
    badDropRate: 0,        // 0% bad drops
    dropInterval: 750,     // Same as medium
    speedMultiplier: 0.75   // 25% slower (multiply duration by 1.25)
  },
  medium: {
    badDropRate: 0.2,      // 20% bad drops
    dropInterval: 500,     // 500ms between drops
    speedMultiplier: 1     // Normal speed
  },
  hard: {
    badDropRate: 0.4,      // 40% bad drops
    dropInterval: 400,     // 20% faster drop rate (500 * 0.8)
    speedMultiplier: 1.5   // 50% faster (divide duration by 1.5)
  }
};

let currentDifficulty = 'medium';

// Wait for button click to handle start/pause/resume
document.getElementById("start-btn").addEventListener("click", handleGameButton);

// Listen for difficulty changes
document.getElementById("difficulty-select").addEventListener("change", function(e) {
  currentDifficulty = e.target.value;
});

function handleGameButton() {
  if (!gameRunning) {
    // Game not running, start it
    startGame();
  } else if (gamePaused) {
    // Game is paused, resume it
    resumeGame();
  } else {
    // Game is running, pause it
    pauseGame();
  }
}

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  gamePaused = false;
  timeLeft = 30;
  document.getElementById("time").textContent = timeLeft;
  startCountdown();

  score = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("game-over-popup").style.display = "none";

  // Update button text to "Pause"
  document.getElementById("start-btn").textContent = "Pause";

  // Create new drops based on difficulty interval
  const settings = difficultySettings[currentDifficulty];
  dropMaker = setInterval(createDrop, settings.dropInterval);
}

function pauseGame() {
  gamePaused = true;
  clearInterval(dropMaker);
  clearInterval(countdownTimer);
  
  // Freeze all existing drops
  const drops = document.querySelectorAll('.water-drop');
  drops.forEach(drop => {
    drop.style.animationPlayState = 'paused';
  });
  
  // Update button text to "Resume"
  document.getElementById("start-btn").textContent = "Resume";
}

function resumeGame() {
  gamePaused = false;
  
  // Resume countdown
  startCountdown();
  
  // Resume creating drops
  const settings = difficultySettings[currentDifficulty];
  dropMaker = setInterval(createDrop, settings.dropInterval);
  
  // Unfreeze all existing drops
  const drops = document.querySelectorAll('.water-drop');
  drops.forEach(drop => {
    drop.style.animationPlayState = 'running';
  });
  
  // Update button text back to "Pause"
  document.getElementById("start-btn").textContent = "Pause";
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
  gamePaused = false;
  clearInterval(dropMaker);
  clearInterval(countdownTimer);
  
  // Reset button text to "Start Game"
  document.getElementById("start-btn").textContent = "Start Game";
  
  // Show game over popup
  document.getElementById("final-score").textContent = score;
  document.getElementById("game-over-popup").style.display = "flex";
}
function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");

  // Get current difficulty settings
  const settings = difficultySettings[currentDifficulty];

  // Check for bad drop based on difficulty
  const isBadDrop = Math.random() < settings.badDropRate;
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
  // Adjust based on difficulty speed multiplier
  const minDuration = 4; // seconds
  const maxDuration = 8; // seconds
  const baseDuration = Math.random() * (maxDuration - minDuration) + minDuration;
  const duration = baseDuration / settings.speedMultiplier;
  drop.style.animationDuration = duration + "s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  // Add click event to update score
  drop.addEventListener("click", () => {
    if (gameRunning && !gamePaused) {
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
