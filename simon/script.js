`use strict`;

///////////////////////////////// MODAL /////////////////////////////////

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnOpenModal = document.querySelector(".show-modal");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenModal.addEventListener("click", openModal);
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

////////////////////////////////// GAME //////////////////////////////////

// initializing variables
let scoreEl = document.querySelector(".current-score");
let highScoreEl = document.querySelector(".high-score");
const allColorBtnEl = document.querySelectorAll(".btn");
const bodyEl = document.querySelector("body");

const colorButtons = [`red`, `blue`, `green`, `yellow`];

const btnPlay = document.querySelector(".play");

let simonPattern, userPattern, started, round, score, highScore;

// when the first game loads:
// set user pattern to empty array
userPattern = [];
// current score = 0
scoreEl.innerText = 0;
// get high score from local storage, if no high score, set it to 0
highScore = JSON.parse(localStorage.getItem("highScore")) || 0;
// update highscore element
highScoreEl.innerText = highScore;
// add disabled class to all color buttons
allColorBtnEl.forEach((btn) => {
  btn.classList.add("btn__disabled");
});

// creates new audio object and plays the relative sounds
const playSound = function (soundName) {
  const audio = new Audio("./sounds/" + soundName + ".mp3");
  audio.play();
};

// animates simon signal
const animateSignal = function (colorBtn) {
  // adding animation class
  document.getElementById(`${colorBtn}`).classList.add("fadeinout");

  // removing animation class after a delay of 0.2 seconds
  setTimeout(function () {
    document.getElementById(`${colorBtn}`).classList.remove("fadeinout");
  }, 200);
};

// animates button press
const animatePress = function (color) {
  // adding button pressed class
  document.getElementById(color).classList.add("pressed");

  // removing button pressed class after a delay of 0.1 second
  setTimeout(function () {
    document.getElementById(color).classList.remove("pressed");
  }, 100);
};

// game over function
const gameOver = function () {
  // play wrong move sound
  playSound("wrong");

  // make buttons disabled and change the color of body to red
  allColorBtnEl.forEach((btn) => {
    btn.classList.add("btn__disabled");
    bodyEl.classList.add("body__game-over");
  });
};

// next sequence
const nextSequence = function () {
  // reset user input pattern to empty
  userPattern = [];

  // generate a random signal
  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColor = colorButtons[randomNumber];

  // push the random signal to simon pattern
  simonPattern.push(randomChosenColor);
  console.log(simonPattern);

  // animate random signal to indicate user
  animateSignal(randomChosenColor);

  // play sound for the random signal generated
  playSound(randomChosenColor);
};

// check user input pattern with simon pattern
const checkPattern = function (currentRound) {
  // When a colored button is pressed, it calls this function with the argument as the length
  // of user pattern array - 1, which is essentially the number of current round of the game

  // checking if the most recent user answer is the same as the game pattern
  if (simonPattern[currentRound] === userPattern[currentRound]) {
    // if the answer is correct, checking if the user entered sequence is finished by
    // comparing the length of simon pattern and user pattern
    if (userPattern.length === simonPattern.length) {
      // if the sequence is complete, call nextSequence() after 1000ms delay and update score
      setTimeout(function () {
        score++;
        scoreEl.innerText = score;
        nextSequence();
      }, 1000);
    }
  } else {
    // if entered sequence is wrong, call the gameOver() function
    gameOver();
    // update scores
    if (score > highScore) {
      highScore = score;
      highScoreEl.innerText = highScore;
      localStorage.setItem("highScore", JSON.stringify(highScore));
    }
  }
};

// initializing game
const init = function () {
  simonPattern = [];
  userPattern = [];
  started = false;
  round = 0;
  scoreEl.innerText = 0;
  score = 0;
};

// newGame function
const newGame = function () {
  // removes the disabled class from colored buttons
  allColorBtnEl.forEach((btn) => {
    btn.classList.remove("btn__disabled");
  });

  // removes the game over class from body
  bodyEl.classList.remove("body__game-over");

  // re-initialize game
  init();

  // call for the first sequence in the simon pattern
  nextSequence();
};

// listen for when any of the color button is pressed
allColorBtnEl.forEach((btn) => {
  btn.addEventListener("click", function () {
    // check which color button is pressed
    const userChosenColor = this.id;
    console.log(userChosenColor);

    // push the pressed button in user pattern array
    userPattern.push(userChosenColor);
    // play the relative sound
    playSound(userChosenColor);
    // animate the button press
    animatePress(userChosenColor);

    // call checkPattern function to compare simon pattern and user entered pattern
    checkPattern(userPattern.length - 1);
  });
});

btnPlay.addEventListener("click", function () {
  // call newGame function when user clicks NEW GAME button
  newGame();
});
