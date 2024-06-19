let numberOfPlayers;
let players;
let turn;
let stopEvent = true;
let winners;

document.getElementsByClassName("game")[0].style.display = "none";

const modal = document.getElementById("playerModal");
const startGameBtn = document.getElementById("startGame");
const playerSelect = document.getElementById("playerSelect");
const reset = document.getElementById("reset");
const restart = document.getElementById("restart");
const leaderboardModal = document.getElementById("leaderboard");
const scoreboard = document.querySelector('.scoreboard')
const scoreboardHover = document.querySelector('.scoreboard:hover')

reset.addEventListener("click", resetGame);
restart.addEventListener("click", resetGame);

startGameBtn.addEventListener("click", startGame);

function resetGame() {
  leaderboardModal.style.display = "none";
  document.getElementsByClassName("game")[0].style.display = "none";
  document.querySelector("#red").style.marginLeft = "0vmin";
  document.querySelector("#red").style.marginTop = "0vmin";
  document.querySelector("#blue").style.marginLeft = "0vmin";
  document.querySelector("#blue").style.marginTop = "0vmin";
  document.querySelector("#green").style.marginLeft = "0vmin";
  document.querySelector("#green").style.marginTop = "0vmin";
  document.querySelector("#yellow").style.marginLeft = "0vmin";
  document.querySelector("#yellow").style.marginTop = "0vmin";
  document.querySelector("#orange").style.marginLeft = "0vmin";
  document.querySelector("#orange").style.marginTop = "0vmin";
  modal.style.display = "flex";
}

function startGame() {
  numberOfPlayers = parseInt(playerSelect.value);
  for (i = 0; i < 5; i++) {
    let elem = document.querySelector(`.players:nth-child(${i + 1})`);
    if (i >= numberOfPlayers) elem.style.display = "none";
    else elem.style.display = "block";
  }
  stopEvent = false;
  players = ["red", "blue", "green", "yellow", "orange"];
  turn = "red";
  scoreboard.style.backgroundColor = `${turn}`;
  document.querySelector("#heading").innerHTML = `Snake And Ladder`;
  document.querySelector("#p_turn").innerHTML = `${turn} player's turn`;
  winners = [];
  modal.style.display = "none";
  document.getElementsByClassName("game")[0].style.display = "block";
}

scoreboard.addEventListener("click", async (e) => {
  if (!stopEvent) {
    stopEvent = true;
    let diceNum = await roll();
    let isOutOfRange = checkRange(diceNum);
    await new Promise((resolve) => setTimeout(resolve, 400)); //before run
    if (!isOutOfRange) {
      await run(diceNum);
      await new Promise((resolve) => setTimeout(resolve, 400)); //after run
    }
    checkWin();
    if (winners.length < numberOfPlayers - 1) {
      changeTurn();
      stopEvent = false;
    } else {
      gameEnd();
    }
  }
});

function gameEnd() {
  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = "";
  winners.forEach((winner, index) => {
    const li = document.createElement("li");
    li.textContent = `${winner}`;
    leaderboardList.appendChild(li);
  });
  const lli = document.createElement("li");
  console.log(players[0], turn);
  lli.textContent = `${players[0]}`;
  leaderboardList.appendChild(lli);
  document.getElementsByClassName("game")[0].style.display = "none";
  leaderboardModal.style.display = "flex";
}

function checkWin() {
  if (marginTop() == -72 && marginLeft() == 0) {
    if (winners.length === 0) {
      //play audio
      new Audio('goodresult.mp3').play()
      document.querySelector("#heading").innerHTML = `${turn} player wins!`;
    }
    winners.push(turn);
    players = players.filter((player) => player !== turn);
    console.log(players, winners);
  }
}

function checkRange(diceNum) {
  let isOutOfRange = false;
  if (marginTop() == -72 && marginLeft() + Number(diceNum * -8) < 0) {
    isOutOfRange = true;
  }
  return isOutOfRange;
}

function changeTurn() {
  let currentIndex = players.indexOf(turn);
  let nextIndex = (currentIndex + 1) % (numberOfPlayers - winners.length);
  turn = players[nextIndex];
  document.querySelector("#p_turn").innerHTML = `${turn} player's turn`;
  scoreboard.style.backgroundColor = `${turn}`
  // scoreboardHover.style.backgroundColor = `white`
  console.log(turn, nextIndex);
}

function run(diceNum) {
  return new Promise(async (resolve, reject) => {
    for (i = 1; i <= diceNum; i++) {
      let direction = getDirection();
      await move(direction);
    }
    await checkLaddersAndSnakes();
    resolve();
  });
}

function checkLaddersAndSnakes() {
  // [left, top]
  // 1, 2, 3,  4,  5,  6,  7,  8,  9,  10
  // 0, 8, 16, 24, 32, 40, 48, 56, 64, 72
  return new Promise(async (resolve, reject) => {
    let froms = [
      [0, -8],
      [40, -16],
      [40, -32],
      [64, -40],
      [32, -56],
      [8, -56],
      [32, -72],
      [56, -64],
      [56, 0],
      [48, -8],
      [8, -16],
      [56, -16],
      [16, -32],
      [48, -48],
      [24, -56],
      [64, -64],
    ];

    let tos = [
      [16, 0],
      [48, 0],
      [24, 0],
      [48, -24],
      [8, -24],
      [0, -40],
      [56, -48],
      [72, -48],
      [64, -8],
      [32, -32],
      [0, -24],
      [72, -48],
      [24, -48],
      [40, -56],
      [16, -72],
      [72, -72],
    ];
    for (let i = 0; i < tos.length; i++) {
      if (marginLeft() == froms[i][0] && marginTop() == froms[i][1]) {
        new Audio("jump.mp3").play();
        document.querySelector(
          `#${turn}`
        ).style.marginLeft = `${tos[i][0]}vmin`;
        document.querySelector(`#${turn}`).style.marginTop = `${tos[i][1]}vmin`;
        await new Promise((resolve) => setTimeout(resolve, 400));
        break;
      }
    }
    resolve();
  });
}

function move(direction) {
  return new Promise(async (resolve, reject) => {
    new Audio('move.mp3').play()
    if (direction == "up") {
      document.querySelector(`#${turn}`).style.marginTop =
        String(marginTop() - 8) + "vmin";
    } else if (direction == "right") {
      document.querySelector(`#${turn}`).style.marginLeft =
        String(marginLeft() + 8) + "vmin";
    } else if (direction == "left") {
      document.querySelector(`#${turn}`).style.marginLeft =
        String(marginLeft() - 8) + "vmin";
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    resolve();
  });
}

function getDirection() {
  let direction;
  if (
    (marginLeft() == 72 && ((marginTop() * 10) % (-16 * 10)) / 10 == 0) ||
    (marginLeft() == 0 && ((marginTop() * 10) % (-16 * 10)) / 10 != 0)
  ) {
    direction = "up";
  } else if (((marginTop() * 10) % (-16 * 10)) / 10 == 0) {
    direction = "right";
  } else {
    direction = "left";
  }
  return direction;
}

function marginLeft() {
  return Number(
    document.querySelector(`#${turn}`).style.marginLeft.split("v")[0]
  );
}
function marginTop() {
  return Number(
    document.querySelector(`#${turn}`).style.marginTop.split("v")[0]
  );
}

function roll() {
  return new Promise(async (resolve, reject) => {
    let diceNum = Math.floor(Math.random() * 6) + 1;
    let values = [
      [0, -360],
      [-180, -360],
      [-180, 270],
      [0, -90],
      [270, 180],
      [90, 90],
    ];
    new Audio("die.mp3").play();
    document.querySelector(
      "#cube_inner"
    ).style.transform = `rotate(360deg) rotateY(360deg)`;
    await new Promise((resolve) => setTimeout(resolve, 750));
    document.querySelector("#cube_inner").style.transform = `rotateX(${
      values[diceNum - 1][0]
    }deg) rotateY(${values[diceNum - 1][1]}deg)`;
    await new Promise((resolve) => setTimeout(resolve, 750));
    resolve(diceNum);
  });
}
