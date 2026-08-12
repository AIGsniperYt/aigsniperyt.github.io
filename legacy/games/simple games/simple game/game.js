const canvas = document.getElementById("game-container");
const ctx = canvas.getContext("2d");

// Resize the canvas to cover the entire screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    // Call the resizeCanvas function initially and whenever the window is resized
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    playerX = canvas.width / 2; // Initial player X position
    playerY = canvas.height / 2; // Initial player Y position

    playerRotation = 0;

    zombiesKilled = 0;

    wPressed = false;
    aPressed = false;
    sPressed = false;
    dPressed = false;

    bullets = []; // Initialize an empty array to store bullets
    zombies = []; // Initialize an empty array to store zombies
    particles = []; // Initialize an empty array to store particles

    equippedWeapon.speedReload();

    health = 1100; // Initial player health
    energy = 0; // Initial player energy

    // Start the game loop
    gameLoop();

    // Calculate the amount of energy to regenerate based on regenRate and regenInterval
    setInterval(() => {
        energy = Math.min(energy + 10, maxEnergy);
    }, 1000);
}

let zombiesKilled = 0;

let playerX = canvas.width / 2; // Initial player X position
let playerY = canvas.height / 2; // Initial player Y position

const playerWidth = 40; // Player triangle width
const playerHeight = 40; // Player triangle height

let playerRotation;

let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;

let bullets = []; // Initialize an empty array to store bullets
let zombies = []; // Initialize an empty array to store zombies
let particles = []; // Initialize an empty array to store particles

let health = 1100; // Initial player health
let energy = 0; // Initial player energy
let maxEnergy = 100;


// Define mouseX and mouseY variables outside the function
let mouseX, mouseY;

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
        wPressed = true;
        break;
        case "a":
        aPressed = true;
        break;
        case "s":
        sPressed = true;
        break;
        case "d":
        dPressed = true;
        break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w":
        wPressed = false;
        break;
        case "a":
        aPressed = false;
        break;
        case "s":
        sPressed = false;
        break;
        case "d":
        dPressed = false;
        break;
    }
});

function movePlayer() {
    const speed = 5;

    if (wPressed && playerY > 0 + playerWidth) {
        playerY -= speed;
    }
    if (aPressed && playerX > 0 + playerWidth) {
        playerX -= speed;
    }
    if (sPressed && playerY < canvas.height - playerWidth) {
        playerY += speed;
    }
    if (dPressed && playerX < canvas.width - playerWidth) {
        playerX += speed;
    }

    drawPlayer();

}



function drawPlayer() {
    ctx.save(); // Save the current transformation state

    // Calculate the angle to rotate the triangle towards the mouse cursor
    const dx = mouseX - playerX;
    const dy = mouseY - playerY;
    playerRotation = Math.atan2(dy, dx) + Math.PI / 2; // Update the player rotation angle

    // Translate the canvas origin to the player's position
    ctx.translate(playerX, playerY);

    // Rotate the canvas to point the triangle towards the mouse cursor
    ctx.rotate(playerRotation);

    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(0, -playerHeight / 2); // Top point of the triangle
    ctx.lineTo(-playerWidth / 2, playerHeight / 2); // Bottom-left corner
    ctx.lineTo(playerWidth / 2, playerHeight / 2); // Bottom-right corner
    ctx.closePath();

    // Fill the triangle with blue color
    ctx.fillStyle = "#a1f9ff";
    ctx.fill();

    ctx.restore(); // Restore the previous transformation state


    // Draw health bar
    ctx.fillStyle = "red";
    ctx.fillRect(playerX - 50, playerY + 30, health, 10);

    // Draw energy bar
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX - 50, playerY + 40, energy, 10);
}


function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000"; // Dark gray color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with dark gray
}



class Zombie {
    constructor(x, y, radius, color, speed, health) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.originalSpeed = speed; // Store the original speed
        this.health = health; // New property to represent zombie's health
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move(playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const angle = Math.atan2(dy, dx);
        const velocityX = Math.cos(angle) * this.speed;
        const velocityY = Math.sin(angle) * this.speed;

        this.x += velocityX;
        this.y += velocityY;
    }

    update(playerX, playerY) {
        // Calculate distance between zombie and player
        const dx = this.x - playerX;
        const dy = this.y - playerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if the zombie is colliding with the player
        if (distance < playerWidth / 3 + this.radius) {
            // Disable natural movement towards the player during knockback
            this.speed = 0;

            // Calculate knockback effect
            const knockbackStrength = 200; // Adjust the strength as needed

            // Calculate knockback direction
            const angle = Math.atan2(dy, dx);
            const knockbackX = Math.cos(angle) * knockbackStrength;
            const knockbackY = Math.sin(angle) * knockbackStrength;

            // Apply knockback to the zombie
            this.knockback(knockbackX, knockbackY);
        } else {
            this.speed = this.originalSpeed; // Reset speed to its original value
            this.move(playerX, playerY);
        }
    }

    knockback(knockbackX, knockbackY) {
        // Move the zombie gradually towards its new position after knockback
        const knockbackDistance = Math.sqrt(knockbackX * knockbackX + knockbackY * knockbackY);
        const knockbackStepX = knockbackX / 4; // Move 1/4 of the distance each step
        const knockbackStepY = knockbackY / 4;

        this.x += knockbackStepX;
        this.y += knockbackStepY;

        // Check if the zombie has reached its new position
        if (knockbackDistance < 5) { // Adjust the threshold as needed
            // Zombie has reached its new position, stop knockback
            this.x += knockbackX;
            this.y += knockbackY;
            this.speed = this.originalSpeed; // Reset speed to its original value
            return;
        }

        // Schedule the next step of knockback animation
        requestAnimationFrame(() => this.knockback(knockbackX - knockbackStepX, knockbackY - knockbackStepY));
    }


    reduceHealth(damage) {
        // Reduce zombie health
        this.health -= damage;

        // Check if health is below the threshold to change color
        if (this.health <= 50 && this.health > 0) {
            // Change zombie color to darker green
            this.color = "darkgreen";
        }

        // Check if health is zero or less
        if (this.health <= 0) {
            // Remove the zombie
            return true; // Signal that the zombie should be removed
        }

        return false; // Signal that the zombie should not be removed
    }
}




class Weapon {
    constructor(name, magazineSize, penetrationCapacity, bulletDamage, reloadingTime, shootCooldown) {
        this.name = name;
        this.magazineSize = magazineSize;
        this.penetrationCapacity = penetrationCapacity;
        this.bulletSpeed = this.calculateBulletSpeed(bulletDamage); // Calculate bullet speed based on damage
        this.bulletDamage = bulletDamage;
        this.remainingBullets = magazineSize;
        this.reloadingTime = reloadingTime;
        this.isReloading = false;
        this.shootCooldown = shootCooldown; // New parameter for shoot cooldown
        this.canShoot = true; // Flag to track if the weapon can shoot
    }

    calculateBulletSpeed(damage) {
        // Determine bullet speed based on damage, considering a non-linear relationship
        const baseSpeed = 19; // Base bullet speed
        const maxDamage = 100; // Maximum damage for the non-linear curve
        const curveFactor = 0.5; // Adjustment factor for the curve

        // Apply non-linear relation
        let bulletSpeed = baseSpeed + (Math.pow(damage, curveFactor) / Math.pow(maxDamage, curveFactor)) * baseSpeed;
        bulletSpeed = bulletSpeed / 2;
        console.log(this.name);
        console.log(bulletSpeed);
        return bulletSpeed;
    }

    fire(playerX, playerY, targetX, targetY) {
        if (this.remainingBullets <= 0 || !this.canShoot) {
            this.reload();
            return null; // Cannot shoot if out of bullets or on cooldown
        }

        const bulletSpeedMultiplier = 1.3; // How fast bullets should go

        // Calculate bullet velocity
        const dx = targetX - playerX;
        const dy = targetY - playerY;
        const angle = Math.atan2(dy, dx);
        const velocityX = Math.cos(angle) * this.bulletSpeed * bulletSpeedMultiplier;
        const velocityY = Math.sin(angle) * this.bulletSpeed * bulletSpeedMultiplier;

        // Create a new bullet object
        const bullet = new Bullet(playerX, playerY, velocityX, velocityY, 10, 35, "#c6f4f7", this.bulletDamage, this.penetrationCapacity);

        this.remainingBullets--; // Decrease remaining bullets
        this.canShoot = false; // Set shoot cooldown

        // Start cooldown timer
        setTimeout(() => {
            this.canShoot = true;
        }, this.shootCooldown);

        return bullet; // Return the bullet object
    }

    reload() {
        if (!this.isReloading && this.remainingBullets === 0) {
            this.isReloading = true;

            // Simulate reloading time
            setTimeout(() => {
                this.remainingBullets = this.magazineSize;
                this.isReloading = false;
            }, this.reloadingTime);
        }
    }

    speedReload() {
        this.remainingBullets = this.magazineSize;
        this.isReloading = false;
    }

}




class Bullet {
    constructor(x, y, velocityX, velocityY, width, height, color, damage, penetration) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.width = width;
        this.height = height;
        this.color = color;
        this.damage = damage;
        this.penetration = penetration;
        this.direction = playerRotation;
        this.hitZombies = []; // Array to store IDs of zombies that the bullet has hit
    }

    draw(ctx) {
        ctx.save(); // Save the current transformation state

        // Translate the canvas origin to the bullet's position
        ctx.translate(this.x, this.y);

        // Rotate the canvas to point the bullet in the direction of the player
        ctx.rotate(this.direction);

        // Draw the bullet (glowy rectangle)
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10; // Increase for more glow
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.restore(); // Restore the previous transformation state
    }



    update(zombies) {
        let removeBullet = false;

        // Update bullet position
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Check if the bullet is off-screen
        if (
            this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height
            ) {
                removeBullet = true;
            }

            // Check collision with each zombie
            for (let i = 0; i < zombies.length; i++) {
                const zombie = zombies[i];
                // Check if this bullet has already collided with this zombie
                if (this.hitZombies.includes(zombie)) {
                    continue; // Skip collision check for this zombie
                }

                // Increase collision detection area
                const dx = this.x - zombie.x;
                const dy = this.y - zombie.y;
                const distanceSquared = dx * dx + dy * dy;
                const minDistanceSquared = (this.width + zombie.radius) ** 2;

                // If collision occurs
                if (distanceSquared < minDistanceSquared) {
                    // Reduce zombie health
                    zombie.reduceHealth(this.damage);

                    // Spawn particles at the collision point
                    spawnParticles(this.x, this.y, this.color);

                    // Add zombie to the set of collided zombies
                    this.hitZombies.push(zombie);

                    // Check if the bullet has reached its penetration limit
                    if (this.penetration >= 0) {
                        removeBullet = true; // Signal that the bullet should be removed
                    } else {
                        removeBullet = false;
                    }
                }

            }

            return removeBullet; // Signal that the bullet should be removed if off-screen or collided
        }



    }

    class Particle {
        constructor(x, y, velocityX, velocityY, color, size) {
            this.x = x;
            this.y = y;
            this.velocityX = velocityX;
            this.velocityY = velocityY;
            this.color = color;
            this.size = size;
            this.opacity = 1; // Initial opacity
            this.fadeRate = 0.01; // Rate at which the particle fades
        }

        draw(ctx) {
            ctx.save(); // Save the current transformation state

            // Set particle color and opacity
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;

            // Draw the particle as a square
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

            ctx.restore(); // Restore the previous transformation state
        }

        update() {
            //console.log("Updating particle...");
            // Update particle position
            this.x += this.velocityX;
            this.y += this.velocityY;

            // Update particle opacity
            this.opacity -= this.fadeRate;
            //console.log("Particle opacity:", this.opacity);

            if (this.opacity < 0.001) {
                // Find the index of this particle in the particles array
                const index = particles.indexOf(this);

                // Remove the particle from the array
                if (index !== -1) {
                    particles.splice(index, 1);
                }
            }

        }



    }


    function spawnParticles(x, y, color) {
        const numParticles = 15; // Number of particles to spawn

        for (let i = 0; i < numParticles; i++) {
            // Generate random velocity for each particle
            const velocityX = (Math.random() - 0.5) * 2; // Random value between -1 and 1
            const velocityY = (Math.random() - 0.5) * 2; // Random value between -1 and 1

            // Create a new particle at the collision point
            const particle = new Particle(x, y, velocityX, velocityY, color, 3); // Adjust size as needed

            // Add the particle to the array
            particles.push(particle);
        }
    }


    function gameLoop() {
        // Clear the canvas and draw the background
        drawBackground();
        // Update player position
        movePlayer();

        // Draw everything
        drawPlayer();

        // Update and draw zombies
        for (let i = 0; i < zombies.length; i++) {
            const zombie = zombies[i];

            // Update zombie position
            zombie.update(playerX, playerY);

            // Check if zombie's health is <= 0
            if (zombie.health <= 0) {
                // Remove zombie from array
                zombies.splice(i, 1);
                i--; // Decrement index to account for removed zombie
                zombiesKilled++;
                console.log(zombiesKilled);
                continue; // Skip the rest of the loop iteration
            }

            // Draw zombie
            zombie.draw(ctx);

            // Check for collision with player
            const dx = zombie.x - playerX;
            const dy = zombie.y - playerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < playerWidth /3  + zombie.radius) {

                health -= 10;

                if (health <= 0) {
                    // Collision occurred, end the game
                    endGame();
                    return; // Exit the game loop
                }

            }
        }

        // Update and draw bullets
        for (let i = 0; i < bullets.length; i++) {
            const bullet = bullets[i];

            // Update bullet position
            const collisionDetected = bullet.update(zombies); // Pass the zombies array to the update function

            // Check collision with zombies
            if (collisionDetected) {
                bullet.penetration--;
                if (bullet.penetration == 0) {
                    // If collision occurred & out of pen capacity, remove bullet
                    bullets.splice(i, 1);
                    i--; // Decrement index to account for removed bullet
                }

            } else {
                // Draw bullet if it hasn't collided
                bullet.draw(ctx);
            }
        }

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];

            // Update particle position and opacity
            particle.update();

            // Draw particle
            particle.draw(ctx);
        }

        // Request the next animation frame
        requestAnimationFrame(gameLoop);
    }


    function endGame() {
        // Perform actions to end the game, such as displaying a game over message, resetting variables, etc.
        alert("Game Over! Zombies KIlled:", zombiesKilled);
        init();
    }


    // Create weapons
    const AK_47 = new Weapon("AK-47", 30, 1, 40, 1200, 120);
    const SMG = new Weapon("SMG", 40, 1, 20, 1000, 50);
    const Pistol = new Weapon("Pistol", 12, 2, 50, 1000, 200);
    const Sniper = new Weapon("Sniper", 6, 3, 100, 2300, 500);
    const Death = new Weapon("Death", Infinity, 100, 100, 0, 0.01);
    const DevWeapon = new Weapon("DevGun", Infinity, 100, 100, 0, 10);;

    let equippedWeapon = Pistol;


    // Variable to track if left mouse button is currently held down
    let isMouseDown = false;

    // Event listener for mouse down
    document.addEventListener("mousedown", (event) => {
        if (event.button === 0) { // Left mouse button pressed
            isMouseDown = true;
            autoFire(); // Pass the event object to autoFire
        }
    });

    // Event listener for mouse move to continuously update mouseX and mouseY
    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX - canvas.getBoundingClientRect().left;
        mouseY = event.clientY - canvas.getBoundingClientRect().top;
    });

    // Event listener for mouse up
    document.addEventListener("mouseup", (event) => {
        if (event.button === 0) { // Left mouse button released
            isMouseDown = false;
        }
    });

    // Function to continuously fire bullets while the left mouse button is held down
    function autoFire() {
        // Check if the left mouse button is still held down
        if (isMouseDown) {
            // Calculate direction from player to mouse cursor
            const dx = mouseX - playerX;
            const dy = mouseY - playerY;
            const angle = Math.atan2(dy, dx);
            const velocityX = Math.cos(angle) * equippedWeapon.bulletSpeed;
            const velocityY = Math.sin(angle) * equippedWeapon.bulletSpeed;

            // Fire the pistol
            const bullet = equippedWeapon.fire(playerX, playerY, playerX + velocityX, playerY + velocityY);

            // Add bullet to bullets array if not null
            if (bullet) {
                bullets.push(bullet);
            }

            // Schedule the next autoFire call
            requestAnimationFrame(() => autoFire()); // Pass the event object to the next autoFire call
        }
    }


    function spawnZombie() {
        const minDistance = 200; // Minimum distance between player and newly spawned zombie
        const maxAttempts = 50; // Maximum number of attempts to find a suitable spawn location

        let attempts = 0;
        let x, y, distance; // Define the distance variable here

        // Generate random coordinates until a suitable spawn location is found
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;

            const dx = x - playerX;
            const dy = y - playerY;
            distance = Math.sqrt(dx * dx + dy * dy); // Assign the distance variable here

            attempts++;
        } while (distance < minDistance && attempts < maxAttempts);

        // If a suitable spawn location is found, create a new zombie instance
        if (attempts < maxAttempts) {
            const newZombie = new Zombie(x, y, 20, "#ae52ff", 2, 100);
            zombies.push(newZombie);
        }
    }


    // Call spawnZombie periodically using setInterval
    setInterval(spawnZombie, 500); // Spawns a zombie every 5 seconds (adjust as needed)

    init();