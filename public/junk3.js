// Tried a couple of ways to do this. To make it more OOP lets use classes to create objects for the game. If I want to test the class I can just call new to see if it works. Example: new Speed() - makes it available to test

// Doing this we get access to prototype inheritance that can then use to call the objects inside of the game. This every time we click the start button for the first time it will create new objects for scoring, speed, game area, and the dots that fall.

// Scoring Area
class Score {
  constructor() {
    // Set the starting score
    this.score = 0;
    this.currentScoreValue = document.getElementById("score");
  }

  // Take the value of the dot in and add it to the current score value
  addToScore(dotValue) {
    this.score += dotValue;
  }

  // Push an update of the score to the score text field to view current score
  update() {
    this.currentScoreValue.textContent = this.score;
  }
}

// Speed Control Slider
class Speed {
  constructor() {
    // Set the starting speed
    this.speed = 20;
    this.speedUserInput = document.getElementById("speed-input");
    this.speedValue = document.getElementById("speed-value");

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
    // console.log(this.speed);
  }
}

// dot object
class Dot {
  // Dot Constants
  MIN_DOT_WIDTH = 10;
  MAX_DOT_WIDTH = 100;
  REFRESH = 100;

  constructor(gameArea, clickedDot, removeDot, id) {
    this.dotSize = this.randomSize(this.MIN_DOT_WIDTH, this.MAX_DOT_WIDTH);
    // This will take the width of the actual window and subtract the max dot width. One issue with this is the responsiveness
    // TODO: See if I can figure out a way to reposition the random dot placement if a user drags the screen size down. Currently window.innerWidth will only get the new size when a dot is added.
    const maxGameArea = window.innerWidth - this.MAX_DOT_WIDTH;
    this.x = this.randomNumber(0, maxGameArea - this.dotSize) + "px";
    console.log(this.x);
    this.y = 0;
    // Create the Dot element so we can style it
    this.Dot = document.createElement("div");

    this.Dot.clickedDot = () => {
      clickedDot(Math.round(100 / this.dotSize));
      this.remove();
    };

    // These are all dot styles from size, to position, and the look of the dot
    this.Dot.style.width = this.dotSize + "px";
    this.Dot.style.height = this.dotSize + "px";
    this.Dot.style.backgroundColor = "red";
    this.Dot.style.borderRadius = "50px";
    this.Dot.style.position = "absolute";
    this.Dot.style.left = this.x + "px";
    this.Dot.style.top = this.y + "px";

    this.gameArea = gameArea;
    this.removeDot = removeDot;

    gameArea.appendChild(this.Dot);
  }

  // Calculate the random size of the dot within the given ranges
  randomSize = (max, min) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  // Calculate a random number that will become our position from the left when the dot is created
  randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // Function to remove the dot when clicked
  remove() {
    this.Dot.remove();
  }

  // This is a function that takes in the speed from the slider and translates that into a rate off fall. If the y location plus the size of the dot are > than the gameArea height we need to remove the dot!
  update(speed) {
    this.y += speed / this.REFRESH;

    if (this.y + this.dotSize >= this.gameArea.offSetHeight) {
      this.remove();
      this.removeDot();
    }

    this.Dot.style.top = this.y + "px";
  }
}

// game-area
class Board {
  constructor(clickedDot) {
    this.dotCount = 0;
    this.dotArray = {};
    this.clickedDot = clickedDot;

    this.gameArea = document.getElementById("board-area");
  }

  addDot() {
    const id = this.dotCount++;

    const dot = new Dot(
      id,
      this.gameArea,
      score => {
        this.clickedDot(score);
        this.removeDot(id);
        // Here we need to create a timeout/await system to hold every second before next dot gets added
        setTimeout(() => this.addDot(), 1000);
      },
      () => {
        this.removeDot(id);
      }
    );
    this.dotArray[id] = dot;
  }

  removeDot(id) {
    delete this.dotArray[id];
  }

  update(speed) {
    Object.keys(this.dotArray).forEach(key =>
      this.dotArray[key].updated(speed)
    );
  }
}

// Were going to use the game object to load the Score, Speed, Dot, Game Area and more
class Game {
  constructor() {
    this.score = new Score();
    this.speed = new Speed();
    this.board = new Board(score => {
      this.score.addToScore(score);
    });
    this.frameCounter = 0;
    this.isRunning = false;
  }

  startGame() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.run();
    }
  }

  pauseGame() {
    this.isRunning = false;
  }

  run() {
    this.score.update();
    this.speed.update();
    this.board.update(this.speed.getCurrentSpeed());

    if (this.frameCounter === 0) {
      this.board.addDot();
    }

    this.frameCounter = (this.frameCounter + 1) % REFRESH;

    if (this.isRunning) {
      setTimeout(() => this.run(), 1000 / REFRESH);
    }
  }
}

//Load the new game object when the DOM has completely loaded
// document.addEventListener("DOMContentLoaded", () => new Game());

const gameRunning = new Game();
gameRunning.run();
