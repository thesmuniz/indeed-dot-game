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

export default Game;
