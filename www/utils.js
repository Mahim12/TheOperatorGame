// 4. Helper function
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getfactorsOfANumber(num) {
  const factors = [];
  // looping through 1 to num
  for (let i = 1; i <= num; i++) {
    // check if number is a factor
    if (num % i == 0) {
      factors.push(i);
    }
  }
  return factors;
}
