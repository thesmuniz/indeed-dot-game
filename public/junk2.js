// Create a object that can be called at game start to create the dots
class Dot {
  // Dot Constants
  MIN_DOT_WIDTH = 10;
  MAX_DOT_WIDTH = 100;
  REFRESH = 10;

  constructor() {
    const dotSize = this.randomSize(this.MIN_DOT_WIDTH, this.MAX_DOT_WIDTH);

    // This will take the width of the actual window and subtract the max dot width. One issue with this is the responsiveness
    // TODO: See if I can figure out a way to reposition the random dot placement if a user drags the screen size down. Currently window.innerWidth will only get the new size when a dot is added.
    const maxGameArea = window.innerWidth - this.MAX_DOT_WIDTH;
    // Create the Dot element so we can style it
    this.Dot = document.createElement("div");

    // These are all dot styles from size, to position, and the look of the dot
    this.Dot.style.width = dotSize + "px";
    this.Dot.style.height = dotSize + "px";
    this.Dot.style.backgroundColor = "red";
    this.Dot.style.borderRadius = "50px";
    this.Dot.style.position = "absolute";
    this.Dot.style.left = this.randomNumber(0, maxGameArea - dotSize) + "px";
    console.log(this.Dot.style.left);
  }

  // Calculate the random size of the dot within the given ranges
  randomSize = (max, min) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  // Calculate a random number that will become our position from the left when the dot is created
  randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  createADot() {
    return this.Dot;
  }
}

// Create a game class that will allow is to call a new game when we click start. Kind of like refreshing and setting up everything
class Game {
  // Setting up our state for the game. This will tell us if the game is running, what the score is, and creating some of the basic properties for id's we are using
  state = {
    currentScore: 0,
    isRunning: false,
    rateOfRefresh: 1000,
    interval: null,
    rateOfMovement: null,
    startButton: document.getElementById("startButton"),
    sliderSpeed: document.getElementById("sliderSpeed"),
    speedLabel: document.getElementById("speedLabel")
  };

  setState = obj => {
    this.state = { ...this.state, ...obj };
    console.log(this.state);
  };

  // Create a basic constructor that allows us to create some properties that we will use to push to state
  constructor() {
    let { startButton, startingScore, sliderSpeed } = this.state;
    this.setScore(0);
    startButton.addEventListener("click", this.toggleStartButton);
    sliderSpeed.addEventListener("change", () => {
      const { intervalOfMoving } = this.state;
      this.setCurrentSpeed();
      clearInterval(intervalOfMoving);
      if (this.state.isRunning) {
        const interval = setInterval(
          this.animateDots,
          this.getMovingRefreshRate()
        );
        this.setState({ intervalOfMoving: interval });
      }
    });
  }

  // Here we will update the score each time an bubble is clicked
  setScore = value => {
    let { currentScore } = this.state;
    const scoreUpdate = currentScore + value;
    this.setState({ currentScore: scoreUpdate });
  };

  dotMovingRefresh = () => {
    Math.floor(this.state.rateOfRefresh / this.currentSpeed());
  };

  currentSpeed = () => parseInt(this.state.sliderSpeed.value, 10);

  setCurrentSpeed = () => {
    const { speedLabel } = this.state;
    speedLabel.innerHTML = `${this.currentSpeed()}`;
  };

  // This is how we will toggle the button to start and pause when we click it
  // TODO: Need to also make this possible when you simply hover to it. The notes state the following "The game starts when a player touches or clicks the Start button; at that point, the Start button changes to a Pause button, which should pause the game until the button is touched or clicked again."

  toggleStartButton = () => {
    let {
      startButton,
      isRunning,
      rateOfRefresh,
      interval,
      rateOfMovement,
      dotMovingRefresh
    } = this.state;
    if (isRunning) {
      this.updateToggleButton(startButton, "Start", "start", "pause");
      this.setState({ isRunning: false });
      console.log(this.state);
      clearInterval(interval);
      clearInterval(rateOfMovement);
    } else {
      this.updateToggleButton(startButton, "Pause", "pause", "start");
      this.setState({
        isRunning: true,
        interval: setInterval(this.addADot, rateOfRefresh),
        rateOfMovement: setInterval(this.animateDots, this.dotMovingRefresh())
      });
      console.log(this.state);
    }
  };

  addADot = () => {
    const dot = new Dot(this.currentSpeed).createADot();
    dot.addEventListener("click", this.dotOnClick);
    gameArea.appendChild(dot);
  };

  deleteDot = dot => dot.parentNode.removeChild(dot);

  dotOnClick = () => {};

  animateDots = () => {
    const height = document.getElementById("gameArea").offsetHeight;
    document.querySelectorAll(".dot").forEach(dot => {
      const positionY = parseInt(dot.style.top, 10),
        shift = positionY + 1;
      if (positionY > height) this.deleteDot(dot);
      dot.style.top = `${shift}px`;
    });
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
