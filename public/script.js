document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("clickbox_username");
  if (username) {
    DisplayGameStart();
  } else {
    DisplayRegistrationMenu();
  }
});

function DisplayGameStart() {
  const username = localStorage.getItem("clickbox_username");
  const highscore = localStorage.getItem("clickbox_highscore") ?? 0;
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = `
        <div id="game_start_container">
            <h1>Welcome ${username}!</h1>
            <p>Current High Score: ${highscore}</p>
            <button id="game_start_btn">Start!</button>
            <br />
            <a id="github_link" href="https://github.com/devrolle/ClickBox" target="_blank">View Source Code</a>
        </div>
    `;

  const gameStartBtn = document.getElementById("game_start_btn");
  gameStartBtn.addEventListener("click", () => {
    DisplayGameplay();
  });
}

function DisplayRegistrationMenu() {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = `
        <div id="register_container">
            <h1>Register</h1>
            <p>Enter a username</p>
            <input type="text" id="username" placeholder="Username" />
            <button id="register_btn">Register</button>
        </div>
    `;

  const registerBtn = document.getElementById("register_btn");
  registerBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value;

    if (username === "") {
      alert("Please enter a username");
      return;
    }

    // Save username to local storage
    localStorage.setItem("clickbox_username", username);
    DisplayGameStart();
  });
}

function DisplayGameplay() {
  let score = 0;
  let time = 30;

  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = `
      <div id="gameplay_container">
        <div class="spotlight" />
        <p id="score_display">Score: ${score}</p>
        <p id="timer">Time Left: ${time >= 10 ? time : `0${time}`}s</p>
        </div>
    `;

  // Create a timer that updates the #timer element every second
  const timerElement = document.querySelector("#timer");
  const timerInterval = setInterval(() => {
    timerElement.innerHTML = `Time Left: ${time >= 10 ? time : `0${time}`}s`;
    time -= 1;

    if (time < 0) {
      clearInterval(timerInterval);
      alert(`Game Over! Your score was ${score}`);
      const highscore = localStorage.getItem("clickbox_highscore") ?? 0;
      if (score > highscore) {
        localStorage.setItem("clickbox_highscore", score);
      }
      DisplayGameStart();
    }
  }, 1000);

  document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const spotlightCenterX = (mouseX / window.innerWidth) * 100;
    const spotlightCenterY = (mouseY / window.innerHeight) * 100;

    const spotlight = document.querySelector(".spotlight");
    if (spotlight) {
      spotlight.style.background = `
      radial-gradient(
        circle 280px at ${spotlightCenterX}% ${spotlightCenterY}%,
        transparent 10%,
        rgba(0, 0, 0, 1) 50%
        )
        `;
    }
  });

  // Generate a random box on the page and place it into the main element
  const randomBox = document.createElement("div");
  randomBox.classList.add("random-box");
  randomBox.style.borderRadius = "4px";
  randomBox.style.top = `${Math.random() * 85}vh`;
  randomBox.style.left = `${Math.random() * 90}vw`;
  document.querySelector("#gameplay_container").appendChild(randomBox);

  const scoreElement = document.querySelector("#score_display");

  randomBox.addEventListener("click", () => {
    const audio = new Audio("/assets/pop.mp3");
    audio.play();
    scoreElement.innerHTML = `Score: ${score + 1}`;
    score += 1;
    randomBox.style.top = `${Math.random() * 85}vh`;
    randomBox.style.left = `${Math.random() * 90}vw`;
  });
}
