document.addEventListener("DOMContentLoaded", function() {
  let nightModeToggle = document.querySelector('input[type="checkbox"]');

  nightModeToggle.addEventListener("change", function() {
    if (nightModeToggle.checked) {
      document.getElementById("app").style.backgroundColor = "#000000";
      document.getElementById("scoringArea").style.boxShadow =
        "0px 6px 21px 5px rgba(0, 0, 0, 0.8)";
      document.getElementById("scoringArea").style.backgroundColor =
        "rgba(0, 0, 0, 0.8)";
    } else {
      document.getElementById("app").style.backgroundColor = "#ffffff";
      document.getElementById("scoringArea").style.boxShadow = "none";
      document.getElementById("scoringArea").style.backgroundColor =
        "rgba(250, 250, 250, 0.8)";
    }
  });
});

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
    const valueOfDot = this.calcDotValue(dotSize);
    const topOfDot = 0 - dotSize;
    // Create the Dot element so we can style it
    this.Dot = document.createElement("div");

    // These are all dot styles from size, to position, and the look of the dot
    this.Dot.style.width = dotSize + "px";
    this.Dot.style.height = dotSize + "px";
    this.Dot.style.top = topOfDot + "px";
    this.Dot.style.borderRadius = "50px";
    this.Dot.style.position = "absolute";
    this.Dot.setAttribute("dot-value", valueOfDot);
    this.Dot.setAttribute("dot-width", dotSize);
    this.Dot.setAttribute("class", "gameDot");
    this.Dot.style.left = this.randomNumber(0, maxGameArea - dotSize) + "px";

    this.Dot.style.backgroundColor = "#" + this.getRandomColor();
  }

  getRandomColor = () => {
    const colorOptions = ["29c0e6", "eea0b5", "43bc87", "9e86da"];
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  };

  // Calculate the random size of the dot within the given ranges
  randomSize = (max, min) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  // Calculate a random number that will become our position from the left when the dot is created
  randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  calcDotValue = dotSize => 11 - dotSize * 0.1;

  createADot() {
    return this.Dot;
  }
}

// Speed Control Slider
class Speed {
  constructor() {
    // Set the starting speed
    this.speed = 20;
    this.rateOfRefresh = 1000;
    this.speedUserInput = document.getElementById("sliderSpeed");
    this.speedValue = document.getElementById("speed");

    // Use the oninput global event handler to pull the user input in as an event
    this.speedUserInput.oninput = event => {
      // Set the current user selected speed to the value that is shown
      this.speed = event.target.value;
      // Call our update function to update the speed
      this.update();
    };
  }

  // Pull the current speed that the user has selected
  getCurrentSpeed() {
    return this.speed;
  }

  // Update function that will be called to replace the text content value with the user selected speed
  update() {
    this.speedValue.textContent = this.speed;
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
    currentSpeed: 20,
    frameRate: 100,
    startButton: document.getElementById("startButton"),
    sliderSpeed: document.getElementById("sliderSpeed"),
    speedLabel: document.getElementById("speed")
  };

  setState = obj => {
    this.state = { ...this.state, ...obj };
    console.log(this.state);
  };

  // Create a basic constructor that allows us to create some properties that we will use to push to state
  constructor() {
    this.speed = new Speed();
    let { startButton, startingScore, sliderSpeed, currentSpeed } = this.state;
    this.setScore(0);
    startButton.addEventListener("click", this.toggleStartButton);
  }

  dotMovingRefresh = () =>
    Math.floor(this.state.rateOfRefresh / this.speed.getCurrentSpeed());

  // Here we will update the score each time an bubble is clicked
  setScore = value => {
    let { currentScore } = this.state;
    const scoreUpdate = currentScore + value;
    this.setState({ currentScore: scoreUpdate });
    score.innerHTML = `${scoreUpdate}`;
    this.updateDotSpeed();
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
      dotMovingRefresh,
      currentSpeed,
      controlElement
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
        rateOfMovement: setInterval(this.moveDots, this.dotMovingRefresh()),
        currentSpeed: parseInt(document.getElementById("speed").innerHTML)
      });
    }
  };

  addADot = () => {
    const dot = new Dot(this.state.currentSpeed).createADot();
    dot.addEventListener("click", this.dotOnClick);
    gameArea.appendChild(dot);
  };

  deleteDot = dot => dot.parentNode.removeChild(dot);

  moveDots = () => {
    const dots = document.querySelectorAll(".gameDot");
    const gameAreaHeight = document.getElementById("gameArea").offsetHeight;

    dots.forEach(dot => {
      const posY = parseInt(dot.style.top, 10),
        shift = posY + 1;
      if (posY > gameAreaHeight) this.deleteDot(dot);
      dot.style.top = `${shift}px`;
    });
  };

  updateDotSpeed = () => {
    sliderSpeed.addEventListener("change", () => {
      const { rateOfMovement } = this.state;
      clearInterval(rateOfMovement);
      if (this.state.isRunning) {
        const interval = setInterval(this.moveDots, this.dotMovingRefresh());
        this.setState({ rateOfMovement: interval });
      }
    });
  };

  dotOnClick = event => {
    const { isRunning } = this.state;
    const dotValue = parseInt(event.target.getAttribute("dot-value"), 10);
    // Only add score/delete dot to total if the game is running
    if (isRunning) {
      this.deleteDot(event.target);
      this.setScore(dotValue);
    }
  };

  // This is a function that takes the toggleStartButton information in, and pushes the correct label out based on the current state of the button
  updateToggleButton = (button, label) => {
    button.innerHTML = label;
  };
}

//Load the new game object when the DOM has completely loaded
document.addEventListener("DOMContentLoaded", () => new Game());
