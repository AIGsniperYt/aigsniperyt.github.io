// game.js

// Get the canvas and its 2D context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const speed = 50

const tileSize = 50; // Adjust as needed
let numRows = 5000 ;
let numCols = 1000 ;

// Create a 2D array to represent the game world
const gameWorld = [];

// Set initial canvas size
resizeCanvas();

window.addEventListener("resize", resizeCanvas)

// Function to resize the canvas based on the window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Recalculate the number of rows and columns based on the new canvas size
    const newNumRows = Math.ceil(canvas.height / tileSize);
    const newNumCols = Math.ceil(canvas.width / tileSize);

    drawPlayer()

    // Repopulate the game world with tiles
    gameWorld.length = 0; // Clear the existing game world

    for (let row = 0; row < newNumRows; row++) {
      const currentRow = [];
      for (let col = 0; col < newNumCols; col++) {
        const tileType = Math.random() < 0.5 ? 'grass' : 'water';
        currentRow.push({ x: col * tileSize, y: row * tileSize, type: tileType });
      }
      gameWorld.push(currentRow);
    }

    // Update the number of rows and columns
    numRows = newNumRows;
    numCols = newNumCols;
    console.log(gameWorld)
  }





// Populate the game world with tiles
for (let row = 0; row < numRows; row++) {
  const currentRow = [];
  for (let col = 0; col < numCols; col++) {
    // Randomly assign a type (you can customize this logic)
    const tileType = Math.random() < 0.5 ? 'grass' : 'water';

    // Push an object representing the tile to the current row
    currentRow.push({ x: col * tileSize, y: row * tileSize, type: tileType });
  }
  // Push the row to the game world
  gameWorld.push(currentRow);
}

// Now you can access any tile by its coordinates and get its type
const tileAt = (x, y) => gameWorld[Math.floor(y / tileSize)][Math.floor(x / tileSize)];

// Function to draw the player
function drawPlayer(x, y) {
  const playerImage = new Image();
  playerImage.src = 'player.png';
  ctx.drawImage(playerImage, x, y, tileSize * 2, tileSize * 2);
}

// Function to generate a random spawn point for the player
function generateRandomSpawnPoint() {
    const randomX = Math.floor(Math.random() * (numCols - 2)) * tileSize;
    const randomY = Math.floor(Math.random() * (numRows - 2)) * tileSize;
    return { x: randomX, y: randomY };
}

// Assuming you have a player object defined somewhere
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    rotation: 0, // Add this property if it's not already there
};

// Draw the tiles on the canvas
function drawTiles() {
    for (const row of gameWorld) {
      for (const tile of row) {
        ctx.fillStyle = tile.type === 'grass' ? 'green' : 'blue';
        ctx.fillRect(tile.x - player.x, tile.y - player.y, tileSize, tileSize);
      }
    }
  }

  // Draw the initial state of the game
  function drawGame() {
    drawTiles();
    drawPlayer(player.x, player.y);
  }



let isUpPressed = false;
let isDownPressed = false;
let isLeftPressed = false;
let isRightPressed = false;

document.addEventListener("keydown", (event) => {
    switch (event.key.toLowerCase()) {
        case "w":
            isUpPressed = true;
            break;
        case "s":
            isDownPressed = true;
            break;
        case "a":
            isLeftPressed = true;
            break;
        case "d":
            isRightPressed = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key.toLowerCase()) {
        case "w":
            isUpPressed = false;
            break;
        case "s":
            isDownPressed = false;
            break;
        case "a":
            isLeftPressed = false;
            break;
        case "d":
            isRightPressed = false;
            break;
    }
});

// Update and render the game
function updateGame() {
    // Calculate movement components
    const moveX = (isLeftPressed ? -1 : 0) + (isRightPressed ? 1 : 0);
    const moveY = (isUpPressed ? -1 : 0) + (isDownPressed ? 1 : 0);

    // Normalize the vector
    const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);

    // Ensure the magnitude is not zero to avoid division by zero
    if (magnitude !== 0) {
      const normalizedMoveX = moveX / magnitude;
      const normalizedMoveY = moveY / magnitude;


      // Move the game world in the opposite direction of the player's movement
      for (const row of gameWorld) {
        for (const tile of row) {
          tile.x -= normalizedMoveX * speed;
          tile.y -= normalizedMoveY * speed;
        }
      }
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the updated game state
    drawGame();

    // Request the next animation frame
    requestAnimationFrame(updateGame);
  }

// Spawn the player at a random location
const playerSpawnPoint = generateRandomSpawnPoint();

// Initial draw of the game
drawGame();

// Start the game loop
updateGame();

function gameLoop() {
    updatePlayerPositions();
    drawCanvas();
    requestAnimationFrame(gameLoop)
}

function drawCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save the current context state before rotating
    ctx.save();

    // Draw the player image at the rotated position
    ctx.drawImage(player.img, -player.width / 2, -player.height / 2, player.width, player.height);

    // Restore the context state after drawing
    ctx.restore();


}




///  I NEED TO FIX THE GENERATING, NOT THE DRAWING,
// DO THIS BY GIVING EACH COORDINATE A POSITION ON THE CANVAS LMAO
// CANT BE ASKED SO YH SORRY