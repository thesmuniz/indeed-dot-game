class Dot {
  MIN_DOT_WIDTH = 10;
  MAX_DOT_WIDTH = 100;

  constructor() {
    const maxWidth = window.innerWidth - this.MAX_DOT_WIDTH;
    const dotSize = this.randomSize();
    const dotValue = this.dotValue(dotSize);
    const dotLeftPosition = this.randomNumber(0, maxWidth);
    const topPosition = 0 - dotSize;
    this.dot = document.createElement("div");
  }

  dotValue = dotSize => 11 - dotSize * 0.1;

  // Get the random size of the dot (Pretty Standard)
  randomSize = (max, min) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  // This will be a random number to give us the position of the dot from the left side of the screen (We are using the Max and Min size of the dot as the boundary for where it can be placed)
  randomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  createDot() {
    return this.dot;
  }
}
