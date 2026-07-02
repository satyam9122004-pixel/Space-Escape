let space = document.querySelector(".space");
const ship = document.getElementById("ship");
const endgame = document.querySelector(".endgame");
let obstbox = document.querySelector(".obstbox");
let enginevideo = document.getElementsByTagName("video")[0];
let video = document.getElementsByTagName("video")[1];
let audio = document.getElementsByTagName("audio")[0];
const rect = space.getBoundingClientRect();
const shipRect = ship.getBoundingClientRect();
let spawnTimeout;
let delay;
let object;
let obstclposprop;
let collisionlinterval;
let shipmovesound;
let laserSound;
let score;
let cs = 0;
let hs = 0;
let hsp = document.getElementsByTagName("p")[0];
let csp = document.getElementsByTagName("p")[1];
let isgameactive = false;

function restart() {
  clearInterval(spawnTimeout);
  clearInterval(collisionlinterval);
  clearInterval(score);
  clearTimeout(delay);
  clearTimeout(spawnTimeout);

  document.querySelectorAll(".laser").forEach((e) => e.remove());

  csp.innerText = "Current score: " + 0;
  hsp.innerText = "Highest score: " + localStorage.getItem("highscore");
  isgameactive = true;
  ship.style.display = "grid";

  hs = Number(localStorage.getItem("highscore")) || 0;
  if (cs >= hs) {
    hs = cs;
    hsp.innerText = "Highest score: " + hs;
    //store highscore
    localStorage.setItem("highscore", hs);
  }
  cs = 0;
  startgame();
}

//   STARTGAME AND SET INTERVALS

function startgame() {
  // repeatidly call create asteroid function acc to game progress
  delay = setTimeout(asteroidprogressivecreation, 2500);

  // check collision every 50ms
  collisionlinterval = setInterval(collision, 50);

  //  reset things to previous after collsion - set ship background, remove blast effect
  ship.style.backgroundImage = 'url("resource/shipimg3-removebg-preview.png")';
  video.style.display = "none";
  video.pause();
  video.currentTime = 0;
  endgame.style.display = "none";

  //add opening soundeff
  openingsoundeff();

  //set scoreboard
  scoreboard();

  // set ship launch animation
  ship.style.animation = "shiplaunch 1.8s linear 1 normal forwards";

  ship.addEventListener(
    "animationend",
    () => {
      ship.style.animation = "none";
    },
    { once: true },
  );

  //restart engine video
  enginevideo.style.display = "block";
}

function asteroidprogressivecreation() {
  if (!isgameactive) return;
  asteroidcreate();

  let nextDelay = Math.max(250, 850 - cs * 7); // asteroid creation speed

  // Schedule the next asteroid
  spawnTimeout = setTimeout(asteroidprogressivecreation, nextDelay);
}

//CREATION OF RANDOM OBSTICLE
function asteroidcreate() {
  let obstcl = document.createElement("div");
  obstcl.classList.add("obj");
  let size = Math.floor(Math.random() * 7) + 1; //1-7;

  // set size of asteroid
  obstcl.style.width = size + "rem";
  obstcl.style.height = size + "rem";

  obstbox.appendChild(obstcl);

  // set position of asteriod
  let spaceposprop = space.getBoundingClientRect();
  obstclposprop = obstcl.getBoundingClientRect();

  const x = Math.random();
  const y = Math.ceil(90 * Math.random());

  let rightmax = spaceposprop.width - obstclposprop.width;

  obstcl.style.left = x * rightmax + "px";
  obstcl.style.top = -15 + "%";

  //SET DIFF ASTROID IMG ACC TO OBJ SIZE
  switch (size) {
    case 1:
      obstcl.style.backgroundImage = 'url("resource/asteroid7.jpeg")';
      obstcl.style.backgroundSize = 2 + "rem";
      obstcl.style.backgroundPositionY = 50 + "%";
      obstcl.style.backgroundPositionX = 50 + "%";
      break;
    case 2:
      obstcl.style.backgroundImage = 'url("resource/asteroid6.jpeg")';
      obstcl.style.backgroundSize = 2.5 + "rem";
      obstcl.style.backgroundPositionY = 50 + "%";
      obstcl.style.backgroundPositionX = 50 + "%";
      break;
    case 3:
      obstcl.style.backgroundImage = 'url("resource/asteroid5.jpeg")';
      obstcl.style.backgroundSize = 3.5 + "rem";
      obstcl.style.backgroundPositionY = 50 + "%";
      obstcl.style.backgroundPositionX = 50 + "%";
      break;
    case 4:
      obstcl.style.backgroundImage = 'url("resource/asteroid4.jpeg")';
      obstcl.style.backgroundSize = 4.5 + "rem";
      obstcl.style.backgroundPositionY = 50 + "%";
      obstcl.style.backgroundPositionX = 50 + "%";
      break;
    case 5:
      obstcl.style.backgroundImage = 'url("resource/asteroid3.jpeg")';
      obstcl.style.backgroundSize = 6.5 + "rem";
      obstcl.style.backgroundPositionY = 50 + "%";
      obstcl.style.backgroundPositionX = 50 + "%";
      break;
    case 6:
      obstcl.style.backgroundImage = 'url("resource/asteroid2.jpeg")';
      obstcl.style.backgroundSize = 7.5 + "rem";
      obstcl.style.backgroundPositionY = 50 + "%";
      obstcl.style.backgroundPositionX = 50 + "%";
      break;
    case 7:
      obstcl.style.backgroundImage = 'url("resource/asteroid1 (1).jpeg")';
      obstcl.style.backgroundSize = 7.5 + "rem";
      obstcl.style.backgroundPositionY = 50 + "%";
      obstcl.style.backgroundPositionX = 50 + "%";
      break;
  }

  // to make asteroid move and remove after it reach to bottom
  moveremoveobstcl(obstcl);
}

function moveremoveobstcl(obstcl) {
  let topup = 0;
  let con = setInterval(() => {
    topup += 12 + Math.floor(cs / 6); //asteroid fall speed
    obstcl.style.top = topup + "px";
    obstclposprop = obstcl.getBoundingClientRect();
    if (topup + obstclposprop.height / 2 >= space.clientHeight) {
      obstcl.remove();
      clearInterval(con);
    }
  }, 25);
}

function openingsoundeff(params) {
  audio.src = "resource/shiplaunchaudio.mpeg";
  audio.currentTime = 0.8;
  audio.play();

  shipmovesound = setTimeout(() => {
    audio.src = "resource/Shipmovesoundeffect.mpeg";
    audio.currentTime = 1;
    audio.loop = true;
    audio.play();
  }, 4000);
}

function scoreboard(params) {
  // score = setInterval(() => {
  //   // cs += 1;
  //   csp.innerText = "Current score: " + cs;
  //   // if (cs >= hs) {
  //   //   hs = cs;
  //   //   hsp.innerText = "Highest score: " + cs;
  //   // }
  // }, 800);
}

// SHIP CURSOR MOMENT
space.addEventListener("mousemove", function (e) {
  const rect = space.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();

  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  // STOP at right & bottom
  x = Math.min(x, rect.width - shipRect.width);
  y = Math.min(y, rect.height - shipRect.height);

  // OPTIONAL: stop at left & top
  x = Math.max(0, x);
  y = Math.max(0, y);

  ship.style.left = x + "px";
  ship.style.top = y + "px";
});

// //TO MOVE SHIP , FIRE LASER , RESTART GAME THROUGH BUTTON
document.addEventListener("keydown", (e) => {
  var spaceRect = space.getBoundingClientRect();
  var shipRect = ship.getBoundingClientRect();

  let top = ship.offsetTop;
  let left = ship.offsetLeft;

  let speed = 10;

  if (e.code === "KeyW" || e.code === "ArrowUp") {
    top = top - speed;
  }
  if (e.code === "KeyS" || e.code === "ArrowDown") {
    top = top + speed;
  }
  if (e.code === "KeyA" || e.code === "ArrowLeft") {
    left = left - speed;
  }
  if (e.code === "KeyD" || e.code === "ArrowRight") {
    left = left + speed;
  }

  top = Math.max(0, Math.min(top, spaceRect.height - shipRect.height));
  left = Math.max(0, Math.min(left, spaceRect.width - shipRect.width));

  ship.style.top = top + "px";
  ship.style.left = left + "px";

  //TO RESTART GAME THROUGH ENTER BUTTON
  if (!isgameactive || endgame.style.display === "flex") {
    if (
      (endgame.style.display == "flex" || endgame.style.display == "block") &&
      e.key == "Enter"
    ) {
      restart();
    }
  } else if (e.code === "Space") {
    shootlaser();
  }
});

// COLLISION
function collision() {
  const shipposition = ship.getBoundingClientRect();
  object = document.querySelectorAll(".obj");

  object.forEach((obj) => {
    let objposition = obj.getBoundingClientRect();

    if (
      shipposition.left < objposition.right &&
      shipposition.right > objposition.left &&
      shipposition.top < objposition.bottom &&
      shipposition.bottom > objposition.top
    ) {
      clearInterval(spawnTimeout);
      clearInterval(collisionlinterval);
      clearInterval(score);
      document.getElementsByTagName("button")[0].innerText = "Restart";
      endgame.style.display = "block";

      // remove old obstacles
      document.querySelectorAll(".obj").forEach((o) => o.remove());

      //play audio on collision
      clearTimeout(shipmovesound);
      audio.src = "resource/loud-explosion-425457.mp3";
      audio.loop = false;
      audio.play();
      audio.currentTime = 0.5;

      //blast effect
      ship.style.backgroundImage = "url()";
      video.style.display = "block";
      video.play();

      //stop engine video
      enginevideo.style.display = "none";

      isgameactive = false;
    }
  });
}

// laser shoot

function shootlaser(params) {
  const shipRect = ship.getBoundingClientRect();
  const spaceRect = space.getBoundingClientRect();

  let laser1 = document.createElement("div");
  let laser2 = document.createElement("div");
  laser1.classList.add("laser");
  laser2.classList.add("laser");

  let shipCenter = shipRect.left - spaceRect.left + shipRect.width / 2;

  // Adjust '0.3' (30%) to line up exactly with your ship's wings
  let wingOffset = shipRect.width * 0.35;

  // Position lasers relative to the center
  laser1.style.left = shipCenter - wingOffset + "px";
  laser2.style.left = shipCenter + wingOffset + "px";

  laser1.style.top = shipRect.top + 30 + "px";
  laser2.style.top = shipRect.top + 30 + "px";

  space.appendChild(laser1, shipRect.top);
  space.appendChild(laser2, shipRect.top);

  //laser sound effect
  audio.pause();
  laserSound = new Audio("resource/3lasersoundeffect.mpeg");
  laserSound.currentTime = 0;
  laserSound.volume = 0.2;
  laserSound.play();

  //make laser move
  moveremovelaser(laser1, laser2, shipRect.top);
}

//reset laser sound to ship moving soung
document.addEventListener("keyup", function (event) {
  laserSound.pause();

  if (endgame.style.display != "block" && event.code == "Space") {
    audio.src = "resource/Shipmovesoundeffect.mpeg";
    audio.currentTime = 1;
    audio.loop = true;
    audio.play();
  }
});

function moveremovelaser(laser1, laser2, startTop) {
  let topup = 0;

  let con = setInterval(() => {
    topup -= 30;
    laser1.style.top = startTop + topup + "px";
    laser2.style.top = startTop + topup + "px";

    laserpos1 = laser1.getBoundingClientRect();
    laserpos2 = laser2.getBoundingClientRect();

    if (laserpos1.top <= rect.top) {
      laser1.remove();
      laser2.remove();
      clearInterval(con);
    }

    //remove asteroid on strike & ++cs
    let asteroids = document.querySelectorAll(".obj");

    let laserposition1 = laser1.getBoundingClientRect();
    let laserposition2 = laser2.getBoundingClientRect();

    asteroids.forEach((obj) => {
      let objposition = obj.getBoundingClientRect();
      if (
        (laserposition1.left < objposition.right &&
          laserposition1.right > objposition.left &&
          laserposition1.top < objposition.bottom &&
          laserposition1.bottom > objposition.top) ||
        (laserposition2.left < objposition.right &&
          laserposition2.right > objposition.left &&
          laserposition2.top < objposition.bottom &&
          laserposition2.bottom > objposition.top)
      ) {
        obj.remove();
        laser1.remove();
        laser2.remove();
        clearInterval(con);
        cs++;
        csp.innerText = "Current score: " + cs;
      }
    });
  }, 50);
}

// set start button;
window.addEventListener("DOMContentLoaded", function () {
  document.getElementsByTagName("button")[0].innerText = "Start";
  ship.style.display = "none";
});
