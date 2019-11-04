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

class Dot {
  MIN_DOT_WIDTH = 10;
  MAX_DOT_WIDTH = 100;
  REFRESH = 10;

  constructor() {
    const dotSize = this.randomSize(this.MIN_DOT_WIDTH, this.MAX_DOT_WIDTH);
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
    this.Dot.style.left = this.randomNumber(0, maxGameArea - dotSize) + "px";

    this.Dot.style.backgroundColor = "#" + this.getRandomColor();
  }

  getRandomColor = () => {
    const colorOptions = ["29c0e6", "eea0b5", "43bc87", "9e86da"];
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  };

  randomSize = (max, min) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  calcDotValue = dotSize => 11 - dotSize * 0.1;

  createADot() {
    return this.Dot;
  }
}

class Speed {
  constructor() {
    this.speed = 20;
    this.rateOfRefresh = 1000;
    this.speedUserInput = document.getElementById("sliderSpeed");
    this.speedValue = document.getElementById("speed");

    this.speedUserInput.oninput = event => {
      this.speed = event.target.value;
      this.update();
    };
  }

  getCurrentSpeed() {
    return this.speed;
  }

  update() {
    this.speedValue.textContent = this.speed;
  }
}

class Game {
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

  constructor() {
    this.speed = new Speed();
    let { startButton, startingScore, sliderSpeed, currentSpeed } = this.state;
    this.setScore(0);
    startButton.addEventListener("click", this.toggleStartButton);
  }

  dotMovingRefresh = () =>
    Math.floor(this.state.rateOfRefresh / this.speed.getCurrentSpeed());

  setScore = value => {
    let { currentScore } = this.state;
    const scoreUpdate = currentScore + value;
    this.setState({ currentScore: scoreUpdate });
    score.innerHTML = `${scoreUpdate}`;
    this.updateDotSpeed();
  };

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
    if (isRunning) {
      this.deleteDot(event.target);
      this.setScore(dotValue);
    }
  };

  updateToggleButton = (button, label) => {
    button.innerHTML = label;
  };
}

document.addEventListener("DOMContentLoaded", () => new Game());
