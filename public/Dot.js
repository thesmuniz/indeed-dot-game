import { randomNumber, randomSize } from "./Helpers.js";

class Dot {
  MIN_DOT_WIDTH = 10;
  MAX_DOT_WIDTH = 100;
  REFRESH = 10;

  constructor() {
    const dotSize = randomSize(this.MIN_DOT_WIDTH, this.MAX_DOT_WIDTH);
    const maxGameArea = window.innerWidth - this.MAX_DOT_WIDTH;
    const valueOfDot = this.calcDotValue(dotSize);
    const topOfDot = 0 - dotSize;
    this.Dot = document.createElement("div");

    this.Dot.style.width = dotSize + "px";
    this.Dot.style.height = dotSize + "px";
    this.Dot.style.top = topOfDot + "px";
    this.Dot.style.borderRadius = "50px";
    this.Dot.style.position = "absolute";
    this.Dot.setAttribute("dot-value", valueOfDot);
    this.Dot.setAttribute("dot-width", dotSize);
    this.Dot.setAttribute("class", "gameDot");
    this.Dot.style.left = randomNumber(0, maxGameArea - dotSize) + "px";

    this.Dot.style.backgroundColor = "#" + this.getRandomColor();
  }

  getRandomColor = () => {
    const colorOptions = ["29c0e6", "eea0b5", "43bc87", "9e86da"];
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  };

  calcDotValue = dotSize => 11 - dotSize * 0.1;

  createADot() {
    return this.Dot;
  }
}

export default Dot;
