// Slider information
let score = 0;
let rateOfFall = 20;

function updatedSpeed(value) {
  rateOfFall = value;
  document.getElementById("speed").innerHTML = rateOfFall;
}

// Dot Constants
MIN_DOT_WIDTH = 10;
MAX_DOT_WIDTH = 100;
ONE_SECOND = 1000; // JS reads in ms to for 1 second we use 1000ms
REFRESH = 10;
MAX_GAME_WIDTH = 1000;
RATE_OF_GRAVITY = 1000;

randomSize = (max, min) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

addDot = () => {
  const newDot = document.createElement("div");
  const dotSize = randomSize(MIN_DOT_WIDTH, MAX_DOT_WIDTH);
  // This will take the width of the actual window and subtract the max dot width. One issue with this is the responsiveness
  // TODO: See if I can figure out a way to reposition the random dot placement if a user drags the screen size down. Currently window.innerWidth will only get the new size when a dot is added.
  const maxGameArea = window.innerWidth - MAX_DOT_WIDTH;

  // These are all dot styles from size, to position, and the look of the dot
  newDot.style.width = dotSize + "px";
  newDot.style.height = dotSize + "px";
  newDot.style.backgroundColor = "red";
  newDot.style.borderRadius = "50px";
  newDot.style.position = "absolute";
  newDot.style.left = randomNumber(0, maxGameArea - dotSize) + "px";
};

// Create a game class that will allow is to call a new game when we click start. Kind of like refreshing and setting up everything
class Game {
  // Setting up our state for the game. This will tell us if the game is running, what the score is, and creating some of the basic properties for id's we are using
  state = {
    currentScore: 0,
    isRunning: false,
    startButton: document.getElementById("startButton")
  };

  setState = obj => {
    this.state = { ...this.state, ...obj };
  };

  // Create a basic constructor that allows us to create some properties that we will use to push to state
  constructor() {
    let { startButton } = this.state;
    this.setScore(0);
    startButton.addEventListener("click", this.toggleStartButton);
  }

  // Here we will update the score each time an bubble is clicked
  setScore = value => {
    let { currentScore } = this.state;
    const scoreUpdate = currentScore + value;
    this.setState({ currentScore: scoreUpdate });
    console.log(this.state);
  };

  // This is how we will toggle the button to start and pause when we click it
  // TODO: Need to also make this possible when you simply hover to it. The notes state the following "The game starts when a player touches or clicks the Start button; at that point, the Start button changes to a Pause button, which should pause the game until the button is touched or clicked again."

  toggleStartButton = () => {
    let { startButton, isRunning } = this.state;
    if (isRunning) {
      this.updateToggleButton(startButton, "Start", "start", "pause");
      this.setState({ isRunning: false });
    } else {
      this.updateToggleButton(startButton, "Pause", "pause", "start");
      this.setState({ isRunning: true });
    }
    console.log(this.state);
  };

  // This is a function that takes the toggleStartButton information in, and pushes the correct label out based on the current state of the button
  updateToggleButton = (button, label, classToAdd, classToRemove) => {
    button.innerHTML = label;
    button.classList.add(classToAdd);
    button.classList.remove(classToRemove);
  };
}

//Load the new game object when the DOM has completely loaded
document.addEventListener("DOMContentLoaded", () => new Game());
