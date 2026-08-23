const appRoot = document.getElementById("app-root");

// 1. Load the Menu when the app starts
document.addEventListener("DOMContentLoaded", () => {
  loadScreen("menu.html");
});

// 2. The core navigation function
async function loadScreen(htmlFile) {
  try {
    // Fetch the HTML file
    const response = await fetch(htmlFile);
    const html = await response.text();

    // Inject it into the master shell
    appRoot.innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${htmlFile}:`, error);
  }
}

// 3. Game specific logic triggered from the menu buttons
async function loadGame(difficulty) {
  // Load the game HTML first
  await loadScreen("game.html");

  // Get the math-row container
  const mathRow = document.querySelector(".math-row");

  // Clear any existing difficulty classes
  mathRow.classList.remove("medium-difficulty", "hard-difficulty");

  // Now that the game HTML is in the DOM, we can set up the math
  let min, max;
  if (difficulty === "easy") {
    min = 1;
    max = 9;
  } else if (difficulty === "medium") {
    min = 10;
    max = 99;
    mathRow.classList.add("medium-difficulty"); // Applies 40px slots
  } else if (difficulty === "hard") {
    min = 100;
    max = 999;
    mathRow.classList.add("hard-difficulty"); // Applies 25px slots
  }

  // Set the random numbers
  document.getElementById("number1").innerHTML = getRandomInteger(min, max);
  document.getElementById("number2").innerHTML = getRandomInteger(min, max);
  document.getElementById("number3").innerHTML = getRandomInteger(min, max);
  document.getElementById("number4").innerHTML = getRandomInteger(min, max);
  document.getElementById("number5").innerHTML = getRandomInteger(min, max);

  // Initialize the random lollipop strand heights
  const strands = document.querySelectorAll(".lollipop-strand");
  strands.forEach((strand) => {
    const randomHeight = Math.floor(Math.random() * 60) + 15;
    strand.style.height = `${randomHeight}px`;
  });
}

// 4. Helper function
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 5. Operator Cycling Logic
const operators = ["+", "-", "*", "/"];

function cycleOperator(buttonElement) {
  // Find what the operator currently is
  let currentOp = buttonElement.innerText;

  // Find its position in our list
  let currentIndex = operators.indexOf(currentOp);

  // Calculate the next index (and loop back to 0 if at the end)
  let nextIndex = (currentIndex + 1) % operators.length;

  // Update the button text
  buttonElement.innerText = operators[nextIndex];
}

// Suppress iOS double-tap and hold magnifying glass loupe
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault(); // Prevents the second tap from triggering the iOS text magnifier
    }
    lastTouchEnd = now;
  },
  { passive: false },
);
