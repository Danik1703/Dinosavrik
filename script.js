document.addEventListener("DOMContentLoaded", function () {
  const mainMenuElement = document.querySelector(".main-menu");
  const startButton = document.getElementById("start-button");
  const gameContainer = document.querySelector(".game-container");
  const dinosaur = document.getElementById("dinosaur");
  const scoreElement = document.getElementById("score");
  const heartsContainer = document.getElementById("hearts");
  const gameOverElement = document.getElementById("game-over");
  const closeElement = document.getElementById("close");
  const finalScoreElement = document.getElementById("final-score");
  const bgMusic = document.getElementById("bg-music");
  let isJumping = false;
  let score = 0;
  let hearts = 3;
  let backgroundChanged = false;

  function jump() {
    if (!isJumping) {
      isJumping = true;
      let position = 0;
      let timerId = setInterval(function () {
        if (position === 150) {
          clearInterval(timerId);
          let downTimerId = setInterval(function () {
            if (position === 0) {
              clearInterval(downTimerId);
              isJumping = false;
            }
            position -= 10;
            dinosaur.style.bottom = position + "px";
          }, 20);
        }
        position += 10;
        dinosaur.style.bottom = position + "px";
      }, 20);
    }
  }

  function generateObstacle() {
    const randomTime = Math.random() * 2000 + 3000;
    let obstacleTypes = ["cactus", "bird"];
    let backgroundImage = "url('photo/cactus.png')";

    if (backgroundChanged) {
      obstacleTypes = ["tree", "bird"];
      backgroundImage = "url('photo/tree.png')";
    }

    const obstacle1 = document.createElement("div");
    obstacle1.classList.add(
      "obstacle",
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]
    );
    obstacle1.style.left = "100%";
    obstacle1.style.bottom = "0";
    obstacle1.style.backgroundImage = backgroundImage;

    const obstacle2 = document.createElement("div");
    obstacle2.classList.add(
      "obstacle",
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]
    );
    obstacle2.style.left = "calc(100% + 200px)";
    obstacle2.style.bottom = "200px";
    obstacle2.style.backgroundImage = "url('photo/bird.gif')";

    gameContainer.appendChild(obstacle1);
    gameContainer.appendChild(obstacle2);

    moveObstacle(obstacle1);
    moveObstacle(obstacle2);

    setTimeout(generateObstacle, randomTime);
  }

  function moveObstacle(obstacle) {
    let obstacleTimerId = setInterval(function () {
      const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));

      if (obstacleLeft > 0 && obstacleLeft < 60 && dinosaur.classList.contains("jump")) {
        hearts--;
        heartsContainer.removeChild(heartsContainer.lastChild);
        if (hearts === 0) {
          gameOver();
        } else {
          obstacle.parentNode.removeChild(obstacle);
        }
      }

      obstacle.style.left = obstacleLeft - 10 + "px";

      if (obstacleLeft <= -60) {
        obstacle.parentNode.removeChild(obstacle);
        score++;
        scoreElement.textContent = "Score: " + score;

        if (score === 6 && !backgroundChanged) {
          document.body.style.transition = "background-image 3s ease-in-out";
          document.body.style.backgroundImage = "url('photo/snow.gif')";
          dinosaur.style.backgroundImage = "url('photo/dino2.png')";

          const obstacles = document.getElementsByClassName("obstacle");
          Array.from(obstacles).forEach(function (obstacle) {
            obstacle.classList.remove("cactus");
            obstacle.classList.add("tree");
            obstacle.style.backgroundImage = "url('photo/tree.png')";
          });

          backgroundChanged = true;
        }
      }
    }, 20);
  }

  function checkCollision() {
    const obstacles = document.getElementsByClassName("obstacle");
    const dinosaurRect = dinosaur.getBoundingClientRect();
   
    Array.from(obstacles).forEach(function (obstacle) {
      const obstacleRect = obstacle.getBoundingClientRect();

      if (
        dinosaurRect.top <= obstacleRect.bottom &&
        dinosaurRect.bottom >= obstacleRect.top &&
        dinosaurRect.right >= obstacleRect.left &&
        dinosaurRect.left <= obstacleRect.right
      ) {
        if (obstacle.classList.contains("cactus") || obstacle.classList.contains("tree")) {
          dinosaur.classList.remove("jump");
          hearts--;
          heartsContainer.removeChild(heartsContainer.lastChild);
          if (hearts === 0) {
            gameOver();
          }
        } else if (obstacle.classList.contains("bird")) {
          return;
        }
      }
    });

    if (hearts === 1 && dinosaur.classList.contains("jump")) {
      gameOver();
    }
  }
  setInterval(checkCollision, 20);
  function gameOver() {
    clearInterval(generateObstacle);
    clearInterval(checkCollision);
    finalScoreElement.textContent = score;
    gameOverElement.style.display = "flex";
    bgMusic.pause();
  }

  startButton.addEventListener("click", function () {
    mainMenuElement.style.display = "none";
    gameContainer.style.display = "block";
    generateObstacle();
    bgMusic.volume = 0.1;
    bgMusic.play();
  });

  closeElement.addEventListener("click", function () {
    gameOverElement.style.display = "none";
    location.reload();
  });

  document.addEventListener("keydown", function (event) {
    if (event.code === "Space" || event.code === "ArrowUp") {
      jump();
      mainMenuElement.style.display = "none";
    }
  });
});
