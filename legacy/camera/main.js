const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Create a world array to store all objects and a grid array
const world = [];
const grid = [];

// WASD movement flags
let moveUp = false, moveDown = false, moveLeft = false, moveRight = false;

// Mouse position
let mouseX = 0, mouseY = 0;

// Tile configuration
const tileSize = 50;  // Size of each tile
const rows = 120;  // Number of rows
const cols = 100;  // Number of columns

const camera = {
    x: 0,
    y: 0,
    cameraWidth: 1000,
    cameraHeight: 1000
};

console.log(camera.cameraWidth);

// Define a class for tiles
class Tile {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    // Method to draw the tile relative to camera
    draw() {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;
        ctx.fillStyle = this.color;
        ctx.fillRect(drawX, drawY, tileSize, tileSize);
    }
}

// Function to create the grid array and randomly assign colors to some tiles
function createGrid() {
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            // Randomize the tile color (10% chance of being a different color)
            const isRandomColor = Math.random() < 0.1;
            const color = isRandomColor ? 'red' : 'lightgray';

            // Create a tile and store it in the grid array
            const tile = new Tile(col * tileSize, row * tileSize, color);
            grid[row].push(tile);
        }
    }
}

// Draw the grid on the canvas
function drawGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid[row][col].draw();
        }
    }
}

// Resize the canvas and re-draw all objects
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawWorld();
}

// Draw all objects in the world array and grid
function drawWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
    drawGrid();
    world.forEach(object => {
        object.update();
        object.draw();
    });
}

// Add a triangle to the world at the center of the screen
class GameObject {
    constructor(type, x, y, size, color) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speed = 5;  // Increased speed
        this.angle = 0;  // Angle the object is pointing towards
    }

    // Update object position and angle
    update() {
        // WASD movement
        if (moveUp) this.y -= this.speed;
        if (moveDown) this.y += this.speed;
        if (moveLeft) this.x -= this.speed;
        if (moveRight) this.x += this.speed;

        // WASD movement for camera too
        if (moveUp) camera.y -= this.speed;
        if (moveDown) camera.y += this.speed;
        if (moveLeft) camera.x -= this.speed;
        if (moveRight) camera.x += this.speed;

        // Calculate angle to point toward the mouse, offset by 90 degrees clockwise
        this.angle = Math.atan2(mouseY - (this.y - camera.y), mouseX - (this.x - camera.x)) - Math.PI / 2;
    }

    // Method to draw the object relative to camera
    draw() {
        ctx.save();
        ctx.translate(this.x - camera.x, this.y - camera.y);
        ctx.rotate(this.angle);

        if (this.type === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);  // Top vertex (now rotated 90 degrees)
            ctx.lineTo(-this.size / 2, this.size / 2);  // Bottom-left vertex
            ctx.lineTo(this.size / 2, this.size / 2);  // Bottom-right vertex
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        ctx.restore();
    }
}

function createWorld() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const triangle = new GameObject('triangle', centerX, centerY, 50, 'blue');  // Smaller triangle
    world.push(triangle);  // Store the triangle in the world array
}

// Handle keyboard input for WASD movement
window.addEventListener('keydown', (e) => {
    if (e.key === 'w') moveUp = true;
    if (e.key === 's') moveDown = true;
    if (e.key === 'a') moveLeft = true;
    if (e.key === 'd') moveRight = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w') moveUp = false;
    if (e.key === 's') moveDown = false;
    if (e.key === 'a') moveLeft = false;
    if (e.key === 'd') moveRight = false;
});

// Track mouse movement
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left + camera.x;
    mouseY = e.clientY - rect.top + camera.y;
});

// Main game loop
function gameLoop() {
    drawWorld();
    requestAnimationFrame(gameLoop);
}

// Initial setup
window.addEventListener('resize', resizeCanvas);

// First, create the grid
createGrid();

// Then, resize the canvas and draw
resizeCanvas();

createWorld();  // Create the triangle
gameLoop();     // Start the game loop
