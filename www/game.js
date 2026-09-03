let numOfTries = 0;

// Operator Cycling Logic
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

// 3. Game specific logic triggered from the menu buttons
async function loadGame(difficulty) {
  numOfTries = 0;
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

  let num1 = getRandomInteger(min, max);
  const factorsOfANumber = getfactorsOfANumber(num1);
  const validFactors = factorsOfANumber.filter(
    (factor) => factor >= min && factor <= max,
  );
  let num2 = validFactors[Math.floor(Math.random() * validFactors.length)];

  // 2. Pick a random starting slot for num1 (1, 2, 3, or 4)
  const pairStartIndex = Math.floor(Math.random() * 4) + 1;

  // 3. Create arrays for our final numbers and hidden operators
  const finalNumbers = [];
  const hiddenOperators = [];

  // Generate the numbers
  for (let i = 1; i <= 5; i++) {
    if (i === pairStartIndex) {
      finalNumbers.push(num1);
    } else if (i === pairStartIndex + 1) {
      finalNumbers.push(num2);
    } else {
      finalNumbers.push(getRandomInteger(min, max));
    }
  }

  // 4. Generate the hidden operators
  const remainingOps = ["+", "-", "*"];

  // Shuffle the remaining operators randomly
  for (let i = remainingOps.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingOps[i], remainingOps[j]] = [remainingOps[j], remainingOps[i]];
  }

  for (let i = 1; i <= 4; i++) {
    if (i === pairStartIndex) {
      // Place the division sign exactly between num1 and num2
      hiddenOperators.push("/");
    } else {
      // Pull one of the remaining unique operators out of the shuffled list
      hiddenOperators.push(remainingOps.pop());
    }
  }

  // 5. Build the string expression and evaluate it
  let mathExpression = finalNumbers[0].toString();
  for (let i = 0; i < 4; i++) {
    mathExpression += hiddenOperators[i] + finalNumbers[i + 1].toString();
  }

  const targetAnswer = eval(mathExpression);

  // You can check the console to see the generated puzzle and answer
  console.log("Hidden expression:", mathExpression);
  console.log("Target answer:", targetAnswer);

  // 6. Assign the numbers to the HTML
  document.getElementById("number1").innerHTML = finalNumbers[0];
  document.getElementById("number2").innerHTML = finalNumbers[1];
  document.getElementById("number3").innerHTML = finalNumbers[2];
  document.getElementById("number4").innerHTML = finalNumbers[3];
  document.getElementById("number5").innerHTML = finalNumbers[4];
  document.getElementById("answer").innerHTML = targetAnswer;

  // Initialize the random lollipop strand heights
  const strands = document.querySelectorAll(".lollipop-strand");
  strands.forEach((strand) => {
    const randomHeight = Math.floor(Math.random() * 60) + 15;
    strand.style.height = `${randomHeight}px`;
  });
}

// 6. Check Answer Logic
function checkAnswer() {
  // If they already used their 3 tries, stop them from guessing again
  if (numOfTries >= 3) {
    alert(
      "Game Over! You have used all 3 tries. Please return to the menu and try again.",
    );
    return;
  }

  // 1. Get all the operators the player has currently selected
  const op1 = document.getElementById("operator1").innerText.trim();
  const op2 = document.getElementById("operator2").innerText.trim();
  const op3 = document.getElementById("operator3").innerText.trim();
  const op4 = document.getElementById("operator4").innerText.trim();

  const userOps = [op1, op2, op3, op4];

  // Validation 1: Check if any buttons still have the default "--"
  if (userOps.includes("--")) {
    alert("You need to select all operators");
    return; // Stop the function here so it doesn't count as a try
  }

  // Validation 2: Check for unique operators
  // A JavaScript 'Set' automatically removes duplicates.
  // If the size is less than 4, it means there were duplicates in the array.
  const uniqueOps = new Set(userOps);
  if (uniqueOps.size !== userOps.length) {
    alert("You need to select unique operators");
    return; // Stop the function here so it doesn't count as a try
  }

  // If the code makes it here, the player submitted a valid guess!
  numOfTries++;

  // 2. Get all the numbers from the screen
  const n1 = document.getElementById("number1").innerText;
  const n2 = document.getElementById("number2").innerText;
  const n3 = document.getElementById("number3").innerText;
  const n4 = document.getElementById("number4").innerText;
  const n5 = document.getElementById("number5").innerText;

  // 3. Build and evaluate the expression
  const playerExpression = n1 + op1 + n2 + op2 + n3 + op3 + n4 + op4 + n5;
  const playerResult = eval(playerExpression);
  const targetAnswer = Number(document.getElementById("answer").innerText);

  // 4. Check if they won or lost
  if (playerResult === targetAnswer) {
    alert(`🎉 Correct! You matched the target in ${numOfTries} try(ies)!`);
  } else {
    const triesLeft = 3 - numOfTries;
    if (triesLeft > 0) {
      alert(
        `Not quite! Your current operators equal ${playerResult}. You have ${triesLeft} try(ies) left!`,
      );
    } else {
      alert(
        `Game Over! You've used all 3 tries. Your final result was ${playerResult}.`,
      );
    }
  }
}
