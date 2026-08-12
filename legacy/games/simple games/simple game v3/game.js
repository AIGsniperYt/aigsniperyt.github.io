const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize the canvas to cover the entire screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let gameWorld = [];
let asteroids = [];

// Function to spawn an asteroid near the player in world coordinates
function spawnAsteroid() {
    let size = Math.random() * 40 + 20; // Random size between 20 and 60
    let spawnDistance = 500; // Spawn within 500 world units from player
    let angle = Math.random() * Math.PI * 2;
    let distance = Math.random() * spawnDistance + 100;

    let asteroidX = player.x + Math.cos(angle) * distance;
    let asteroidY = player.y + Math.sin(angle) * distance;

    let asteroid = new Asteroid(asteroidX, asteroidY, size);
    asteroids.push(asteroid);
}

// Update the camera position to center on the player
function updateCamera() {
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
}

// Initialise player
let player = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: 50,
    height: 50,
    speed: 5,
    direction: 0, // angle in radians
};
let camera = {
    x: player.x - canvas.width / 2,
    y: player.y - canvas.height / 2,
    width: canvas.width,
    height: canvas.height,
};
gameWorld.push(player);

class Asteroid {
    constructor(x, y, size) {
        this.x = x; // World X-coordinate
        this.y = y; // World Y-coordinate

        this.size = this.generateAsteroidSize(50, 150); // Random size between 50 and 150
        this.momentum = 2000;
        this.speed = this.momentum / this.size; // Speed based on size
        this.direction = Math.random() * Math.PI * 2; // Random direction
        this.scrap = Math.floor(this.size * 2); // Scrap proportional to size
        this.hp = Math.floor(this.size * 5); // HP proportional to size
        this.color = `rgba(${Math.floor(Math.random() * 30 + 20)}, 0, ${Math.floor(Math.random() * 50 + 75)}, 1)`; // Asteroid color

        this.angle = 0;
        this.spinSpeed = (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? 1 : -1);
    }

    generateAsteroidSize(mean, maxSize) {
        let size;
        do {
            let u = Math.random();
            let v = Math.random();
            size = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * 20 + mean;
        } while (size < 50 || size > maxSize);
        return size;
    }

    updatePosition() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        this.angle += this.spinSpeed;
    }

    draw(ctx, camera) {
        let screenX = this.x - camera.x;
        let screenY = this.y - camera.y;

        if (
            screenX + this.size > 0 &&
            screenX - this.size < canvas.width &&
            screenY + this.size > 0 &&
            screenY - this.size < canvas.height
        ) {
            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(this.angle);

            ctx.fillStyle = this.color;
            ctx.beginPath();

            let sides = 5;
            let angleStep = (Math.PI * 2) / sides;

            for (let i = 0; i < sides; i++) {
                let angle = angleStep * i;
                let x = Math.cos(angle) * this.size;
                let y = Math.sin(angle) * this.size;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }
}

// Store the player's path as an array of dots
let trail = [];

// Function to create a trail dot
function createTrailDot(x, y) {
    trail.push({
        x: x,
        y: y,
        alpha: 1, // Full opacity initially
        lifetime: 100, // Lifetime before fading
    });
}

// Function to update and draw the trail
function updateAndDrawTrail() {
    for (let i = trail.length - 1; i >= 0; i--) {
        let dot = trail[i];
        dot.alpha -= 0.02; // Fade over time
        dot.lifetime -= 1; // Decrease lifetime

        if (dot.lifetime <= 0) {
            trail.splice(i, 1); // Remove expired trail dot
        }

        let screenX = dot.x - camera.x;
        let screenY = dot.y - camera.y;

        // Draw the trail dot with fading effect
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw the player (triangle)
function drawPlayer() {
    let playerScreenX = player.x - camera.x;
    let playerScreenY = player.y - camera.y;

    ctx.fillStyle = "#0066cc";
    ctx.beginPath();

    let triangleSize = 20;
    ctx.moveTo(
        playerScreenX + Math.cos(player.direction) * triangleSize,
        playerScreenY + Math.sin(player.direction) * triangleSize
    );
    ctx.lineTo(
        playerScreenX + Math.cos(player.direction + Math.PI * 2 / 3) * triangleSize,
        playerScreenY + Math.sin(player.direction + Math.PI * 2 / 3) * triangleSize
    );
    ctx.lineTo(
        playerScreenX + Math.cos(player.direction - Math.PI * 2 / 3) * triangleSize,
        playerScreenY + Math.sin(player.direction - Math.PI * 2 / 3) * triangleSize
    );
    ctx.closePath();
    ctx.fill();
}

// Event listener to track mouse movement
canvas.addEventListener("mousemove", function (event) {
    updatePlayerDirection(event.clientX, event.clientY);
});

// Event listeners for WASD movement
let keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function movePlayer() {
    if (keys["w"]) {
        player.y -= player.speed;
    }
    if (keys["s"]) {
        player.y += player.speed;
    }
    if (keys["a"]) {
        player.x -= player.speed;
    }
    if (keys["d"]) {
        player.x += player.speed;
    }
}

// Spawn a new asteroid every second
setInterval(spawnAsteroid, 1000);

// Update and render asteroids in world coordinates
function updateAndDrawAsteroids() {
    asteroids.forEach((asteroid) => {
        asteroid.updatePosition();
        asteroid.draw(ctx, camera);
    });
}

// Function to draw everything inside the camera
function drawGameWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    updateAndDrawAsteroids();
    drawPlayer();
    updateAndDrawTrail(); // Draw the trail
}

// Update player direction based on mouse
function updatePlayerDirection(mouseX, mouseY) {
    let dx = mouseX - (player.x - camera.x);
    let dy = mouseY - (player.y - camera.y);
    player.direction = Math.atan2(dy, dx);
}

// Game loop to update the game
function gameLoop() {
    resizeCanvas();
    updateCamera();
    movePlayer(); // Move the player based on key input
    createTrailDot(player.x, player.y); // Add trail dot at player position
    drawGameWorld(); // Draw the rest of the game world

    requestAnimationFrame(gameLoop);
}

gameLoop();

// Draw the background
function drawBackground() {
    ctx.fillStyle = "#000015";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
