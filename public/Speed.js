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

export default Speed;
