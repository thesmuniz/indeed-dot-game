export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function randomSize(max, min) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}
