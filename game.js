// get references to HTML elements
const scoreDisplay = document.querySelector('#score');
const messageDisplay = document.querySelector('#message');
const gameCanvas = document.querySelector('#gameCanvas');
const ctx = gameCanvas.getContext('2d');

// set up game variables
let score = 0;
const maxFruits = 20;
const fruitsOnScreen = [];
const fruits = ['apple', 'banana', 'orange', 'lemon'];
const fruitImages = [];
const player = {
  img: new Image(),
  x: gameCanvas.width / 2 - 25,
  y: gameCanvas.height - 50,
  width: 50,
  height: 50,
  speed: 10
};
const keys = {};
player.img.src = 'player.png';

// load fruit images
fruits.forEach(fruit => {
  const img = new Image();
  img.src = `${fruit}.png`;
  fruitImages.push(img);
});

// generate a random fruit image
function generateFruit() {
  const fruitIndex = Math.floor(Math.random() * fruits.length);
  const img = fruitImages[fruitIndex];
  const fruit = {
    img: img,
    x: Math.floor(Math.random() * (gameCanvas.width - img.width)),
    y: Math.floor(Math.random() * (gameCanvas.height - img.height))
  };
  fruitsOnScreen.push(fruit);
}

// collect a fruit
function collectFruit(fruit) {
  const index = fruitsOnScreen.indexOf(fruit);
  if (index !== -1) {
    fruitsOnScreen.splice(index, 1);
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    if (score >= maxFruits) {
      messageDisplay.textContent = 'You Win!';
    }
  }
}

// handle arrow key presses
function handleKeyDown(event) {
  keys[event.code] = true;
  if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
    event.preventDefault();
    const fruit = fruitsOnScreen.find(fruit => {
      return fruit.x <= player.x && fruit.x + fruit.img.width >= player.x &&
             fruit.y <= player.y && fruit.y + fruit.img.height >= player.y;
    });
    if (fruit) {
      collectFruit(fruit);
    }
  }
}

// handle arrow key releases
function handleKeyUp(event) {
  keys[event.code] = false;
}

// handle mouse clicks
function handleClick(event) {
  const fruit = fruitsOnScreen.find(fruit => {
    const rect = gameCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return x >= fruit.x && x <= fruit.x + fruit.img.width &&
           y >= fruit.y && y <= fruit.y + fruit.img.height;
  });
  if (fruit) {
    collectFruit(fruit);
  }
}


 
// update game state and render frame
function update() {
    // move player
    if (keys.ArrowUp && player.y > 0) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < gameCanvas.height - player.height) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < gameCanvas.width - player.width) {
      player.x += player.speed;
    }
  
    // generate fruits
    if (fruitsOnScreen.length < maxFruits) {
      generateFruit();
    }
  
    // clear canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  
    // draw player
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  
    // draw fruits
    fruitsOnScreen.forEach(fruit => {
      ctx.drawImage(fruit.img, fruit.x, fruit.y);
    });
  }
  
  // initialize game state and start game loop
  function init() {
    // add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gameCanvas.addEventListener('click', handleClick);
  
    // start game loop
    setInterval(() => {
      update();
    }, 1000 / 60);
  }
  
// start game
init();
  