// Calculate the random size of the dot within the given ranges
randomSize = (max, min) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

// Calculate a random number that will become our position from the left when the dot is created
randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
