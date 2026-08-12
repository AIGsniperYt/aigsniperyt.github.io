const canvas = document.getElementById("game-container");
const ctx = canvas.getContext("2d");

// Resize the canvas to cover the entire screen
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function init() {
	freeze = false;

	// Call the resizeCanvas function initially and whenever the window is resized
	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);
	playerX = canvas.width / 2; // Initial player X position
	playerY = canvas.height / 2; // Initial player Y position

	playerRotation = 0;

	speed = 5;

	dashDistance = 300; // Adjust the dash distance as needed

	zombiesKilled = 0;

	wPressed = false;
	aPressed = false;
	sPressed = false;
	dPressed = false;

	bullets = []; // Initialize an empty array to store bullets
	zombies = []; // Initialize an empty array to store zombies
	particles = []; // Initialize an empty array to store particles
	powerups = []; // Initialize an empty array to store powerupsw

	bullets.length = 0;
	zombies.length = 0;
	particles.length = 0;
	powerups.length = 0;

	xp = 5;
	level = 1;

	equippedWeapon = weapons[level];

	health = 100; // Initial player health
	energy = 500; // Initial player energy

	godMode = true;
	shield = false;

	regenRate = 500; //**********************

	// Start the game loop
	gameLoop();

	// Display weapon upgrade information at the start of the game
	displayWeaponUpgrade();

	// Calculate the amount of energy to regenerate based on regenRate and regenInterval
	setInterval(() => {
		energy = Math.min(energy + regenRate, maxEnergy);
	}, 500);
}

let speed = 5;

let freeze = false;

let particlesOn = true;

let spacePressed = false; // Define spacePressed variable

let dashing = false;

let zombiesKilled = 0;

// Define initial XP and XP threshold
let xp = 5;
let level = 1;
const xpThresholds = [
	-1, 200, 400, 800, 1000, 2000, 3000, 4000, 5000, 5000, 40000,
]; // Adjust XP thresholds as needed

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
let powerups = []; // Initialize an empty array to store powerups

let health = 100; // Initial player health
const maxHealth = 100;

let energy = 500; // Initial player energy
const maxEnergy = 500;

let regenRate = 10;

// Define dashDistance variable
let dashDistance = 300; // Adjust the dash distance as needed

let godMode = false;
let shield = false;

function updateWeapon() {
	equippedWeapon = weapons[level];
	console.log(equippedWeapon);
}

// GUI **********************************************

// Settings button properties
const buttonSize = 50;
const buttonPadding = 10;
const buttonX = canvas.width - buttonSize - buttonPadding;
const buttonY = buttonPadding;

function settings() {
	toggleFreeze();
	const settingsMenu = document.getElementById("settings-menu");
	settingsMenu.style.display = "block";
}

// Freeze and unfreeze **********************************************

function toggleParticles() {
	particlesOn = !particlesOn; // Toggle particles variable
	const particlesStatus = document.getElementById("particles-status");
	particlesStatus.textContent = particlesOn ? "On" : "Off";
	const particlesToggle = document.getElementById("particles-toggle");
	particlesToggle.classList.toggle("off", !particlesOn);
}

function freezeGame() {
	freeze = true;
}

function unfreezeGame() {
	freeze = false;
}

function toggleFreeze() {
	freeze = !freeze;
}

// Upgrade Weapons **********************************************

// Function to check XP threshold and upgrade weapon
function checkXPThreshold() {
	for (let i = 0; i < xpThresholds.length; i++) {
		if (xp >= xpThresholds[level]) {
			// Upgrade weapon
			level++;
			updateWeapon();
			xp = 0;
			energy = maxEnergy;
			regenRate += 10;
			console.log(level);

			// Display the weapon upgrade information
			displayWeaponUpgrade();
		}
	}
}

// Function to display weapon upgrade information
function displayWeaponUpgrade() {
	freezeGame();

	let name = "New Weapon Unlocked: " + weapons[level].name;
	let description = '"' + descriptions[level] + '"'; // Wrap description in quotes
	let damage = "Damage: " + equippedWeapon.bulletDamage;
	let firerate = "Firerate: " + equippedWeapon.shootCooldown;
	let cost = "Energy cost: " + equippedWeapon.energyCost;
	let pen = "Penetration: " + equippedWeapon.penetrationCapacity;

	updateWeaponCard(name, description, damage, firerate, cost, pen);

	// Wait for 2 seconds before unfreezing the game
	setTimeout(unfreezeGame, 2000);
}

function updateWeaponCard(name, description, damage, firerate, cost, pen) {
	document.getElementById("weapon-name").innerText = name;
	document.getElementById("weapon-description").innerText = description;
	document.getElementById("weapon-damage").innerText = damage;
	document.getElementById("weapon-firerate").innerText = firerate;
	document.getElementById("weapon-cost").innerText = cost;
	document.getElementById("weapon-pen").innerText = pen;
	document.getElementById("weapon-card").style.display = "block";
	setTimeout(hideWeaponCard, 2000);
}

function hideWeaponCard() {
	document.getElementById("weapon-card").style.display = "none";
}

// Function to gain XP
function gainXP(zombie) {
	xp += zombie.maxHealth;
}

// Event listeners **********************************************

// Event listener for context menu event
window.addEventListener("contextmenu", function (event) {
	event.preventDefault(); // Prevent the default browser context menu from appearing
});

/* // Add event listener to hide the settings menu when clicked anywhere
document.addEventListener('click', function() {
    settingsMenu.style.display = 'none';
}, { once: true }); // This ensures the event listener is triggered only once

*/
// Define mouseX and mouseY variables outside the function
let mouseX, mouseY;

// Variable to track if left mouse button is currently held down
let isMouseDown = false;

// Event listener for mouse down
document.addEventListener("mousedown", (event) => {
	if (event.button === 0) {
		// Left mouse button pressed
		isMouseDown = true;
	}
});

// Event listener for mouse move to continuously update mouseX and mouseY
document.addEventListener("mousemove", (event) => {
	mouseX = event.clientX - canvas.getBoundingClientRect().left;
	mouseY = event.clientY - canvas.getBoundingClientRect().top;
});

// Event listener for mouse up
document.addEventListener("mouseup", (event) => {
	if (event.button === 0) {
		// Left mouse button released
		isMouseDown = false;
	}
});

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

// Event listener for key down event
window.addEventListener("keydown", function (event) {
	if (event.key === " ") {
		// Check if spacebar is pressed
		spacePressed = true; // Set spacePressed to true
	}
});

// Event listener for key up event
window.addEventListener("keyup", function (event) {
	if (event.key === " ") {
		// Check if spacebar is released
		spacePressed = false; // Set spacePressed to false
	}
});

// Event listener for mouse down event
window.addEventListener("mousedown", function (event) {
	if (event.button === 2) {
		// Check if right mouse button is pressed
		dashPlayer(); // Trigger dash with mouse coordinates
	}
});

// Functions **********************************************

function gameLoop() {
	// Call updateBars to continuously update the bars
	updateBars();
	// Clear the canvas and draw the background
	drawBackground();
	/*     // Update player position
    movePlayer();

    // Draw everything
    drawPlayer(); */

	if (equippedWeapon.name == "Minigun") {
		equippedWeapon.update();
	}
	// Check for collision with zombies
	for (let i = 0; i < zombies.length; i++) {
		const zombie = zombies[i];
		// Check for collision with player
		const dx = zombie.x - playerX;
		const dy = zombie.y - playerY;
		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < playerWidth / 3 + zombie.radius) {
			if (!godMode && !shield) {
				health -= 10;
				if (health <= 0) {
					// Collision occurred, end the game
					endGame();
					return; // Exit the game loop
				}
			}
		}
	}

	// Update and draw zombies
	for (let i = 0; i < zombies.length; i++) {
		const zombie = zombies[i];

		// Update zombie position
		const shouldRemove = zombie.update(playerX, playerY);

		// Check if zombie should be removed
		if (shouldRemove) {
			// Spawn death effect
			spawnDeathEffect(zombie.x, zombie.y, zombie);

			// Remove zombie from array
			zombies.splice(i, 1);
			i--; // Decrement index to account for removed zombie
			zombiesKilled++;
			gainXP(zombie);
			console.log("zombies killed: " + zombiesKilled);
			continue; // Skip the rest of the loop iteration
		}

		// Draw zombie
		zombie.draw(ctx);
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
	for (let i = 0; i < powerups.length; i++) {
		const powerup = powerups[i];

		// Update particle position and opacity
		powerup.update();

		// Draw particle
		powerup.draw(ctx);
	}

	// Update and draw particles
	for (let i = 0; i < particles.length; i++) {
		const particle = particles[i];

		// Update particle position and opacity
		particle.update();

		// Draw particle
		particle.draw(ctx);
	}
	autoFire();

	// Update player position
	movePlayer();

	// Draw everything
	drawPlayer();

	checkXPThreshold(); // Check if XP threshold is reached after gaining XP

	// Request the next animation frame
	requestAnimationFrame(gameLoop);
}

function spawnRandomPowerup() {
    // Check if the length of the powerups array is less than 8
    if (powerups.length < 6) {
        // Define an array of possible powerup types
        const powerupTypes = ["shield", "health", "speed"];

        // Define an object to track the count of each powerup type
        const powerupCounts = {
            shield: 0,
            health: 0,
            speed: 0
        };

        // Loop through existing powerups to count each type
        for (const existingPowerup of powerups) {
            powerupCounts[existingPowerup.type]++;
        }

        // Randomly choose a powerup type from the array
        let randomType;
        do {
            randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        } while (powerupCounts[randomType] >= 2);

        // Create a new Powerup object with the randomly chosen type
        const powerup = new Powerup(randomType);

        // Generate random x and y positions within the canvas
        const randomX = Math.random() * canvas.width;
        const randomY = Math.random() * canvas.height;

        // Set the powerup's position to the random x and y positions
        powerup.x = randomX;
        powerup.y = randomY;

        // Add the powerup to the powerups array
        powerups.push(powerup);
    }
}


// Function to continuously fire bullets while the left mouse button is held down
function autoFire() {
	// Check if the left mouse button is still held down
	if (isMouseDown && !freeze) {
		// Calculate direction from player to mouse cursor
		const dx = mouseX - playerX;
		const dy = mouseY - playerY;
		const angle = Math.atan2(dy, dx);
		const velocityX = Math.cos(angle) * equippedWeapon.bulletSpeed;
		const velocityY = Math.sin(angle) * equippedWeapon.bulletSpeed;

		if (equippedWeapon.name == "Flamethrower") {
			const angle = playerRotation; // Get player's current rotation

			// Define the cone parameters
			const coneLength = equippedWeapon.distance; // Length of the cone limited by the fixed distance
			const coneWidth = 50; // Width of the cone
			const arcAngle = equippedWeapon.arcAngle; // Arc angle for the flamethrower effect

			// Draw the cone-like effect with the same arc angle
			equippedWeapon.drawCone(
				playerX,
				playerY,
				angle,
				coneLength,
				coneWidth,
				arcAngle
			);
		}

		// Fire the pistol
		const bulletsFired = equippedWeapon.fire(
			playerX,
			playerY,
			playerX + velocityX,
			playerY + velocityY
		);

		// Check if bulletsFired is an array (for Akimbo Pistol)
		if (Array.isArray(bulletsFired)) {
			// Iterate over each bullet in the array and push it into the bullets array
			bulletsFired.forEach((bullet) => {
				bullets.push(bullet);
			});
		} else {
			// Add bullet to bullets array if not null (for other weapons)
			if (bulletsFired) {
				bullets.push(bulletsFired);
			}
		}

		// Schedule the next autoFire call
		requestAnimationFrame(() => autoFire()); // Pass the event object to the next autoFire call
	}
}

// Function to dash the player towards the mouse direction
function dashPlayer() {
	if (!freeze && !dashing && energy >= 50) {
		energy -= 50;
		const angle = Math.atan2(mouseY - playerY, mouseX - playerX); // Calculate angle towards mouse
		const dx = Math.cos(angle) * dashDistance; // Calculate X distance to dash
		const dy = Math.sin(angle) * dashDistance; // Calculate Y distance to dash

		// Calculate the dashed position
		let newX = playerX + dx;
		let newY = playerY + dy;

		// Limit dashed position to stay within the canvas boundaries
		if (newX < 0 + playerWidth) {
			newX = 0 + playerWidth;
		} else if (newX > canvas.width - playerWidth) {
			newX = canvas.width - playerWidth;
		}

		if (newY < 0 + playerWidth) {
			newY = 0 + playerWidth;
		} else if (newY > canvas.height - playerWidth) {
			newY = canvas.height - playerWidth;
		}

		// Move the player towards the modified dashed position
		movePlayerTowards(newX, newY);

		// Set dashing to true
		dashing = true;
		// Set godMode to true (no damage during dash)
		godMode = true;

		// Reset dashing and godMode after a delay
		setTimeout(() => {
			dashing = false;
			godMode = false;
		}, 200); // Adjust the delay time as needed
	}
}

// Function to move the player towards a specific position
function movePlayerTowards(targetX, targetY) {
	const deltaX = targetX - playerX; // Calculate change in X position
	const deltaY = targetY - playerY; // Calculate change in Y position

	const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY); // Calculate distance to target

	// Calculate the movement speed based on dashDistance
	const speedX = ((deltaX / distance) * dashDistance) / 10; // Adjust the division factor as needed
	const speedY = ((deltaY / distance) * dashDistance) / 10; // Adjust the division factor as needed

	// Move the player in steps towards the target position
	const moveInterval = setInterval(() => {
		if (
			Math.abs(playerX - targetX) < Math.abs(speedX) &&
			Math.abs(playerY - targetY) < Math.abs(speedY)
		) {
			// Stop moving if the player is close enough to the target
			clearInterval(moveInterval);
			playerX = targetX;
			playerY = targetY;
		} else {
			// Move the player towards the target
			playerX += speedX;
			playerY += speedY;
		}
	}, 10); // Adjust the interval time as needed
}

function movePlayer() {
	if (!freeze && !dashing) {
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
	ctx.fillStyle = "#6A5ACD";
	ctx.fill();

	ctx.restore(); // Restore the previous transformation state
}

function drawBackground() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000015"; // Dark blue color
	ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas with dark gray
}

// Update HTML status bars **********************************************

// Function to update XP text with smooth animation
function updateXPText() {
	const xpText = document.getElementById("xp-text");
	xpText.textContent = `${xp} / ${xpThresholds[level]}`;
}

// Function to update the width of the XP bar fill with smooth animation
function updateXPBar() {
	const xpFill = document.getElementById("xp-fill");
	const xpPercentage = (xp / xpThresholds[level]) * 100; // Update XP bar based on current XP and level threshold
	xpFill.style.width = `${xpPercentage}%`;
}

// Function to update health text with smooth animation
function updateHealthText() {
	const healthText = document.getElementById("health-text");
	healthText.textContent = `${health} / ${maxHealth}`;
}

// Function to update the width of the health bar fill with smooth animation
function updateHealthBar() {
	const healthFill = document.getElementById("health-fill");
	const healthPercentage = (health / maxHealth) * 100;
	healthFill.style.width = `${healthPercentage}%`;
}

// Function to update energy text with smooth animation
function updateEnergyText() {
	const energyText = document.getElementById("energy-text");
	energyText.textContent = `${energy} / ${maxEnergy}`;
}

// Function to update the width of the energy bar fill with smooth animation
function updateEnergyBar() {
	const energyFill = document.getElementById("energy-fill");
	const energyPercentage = (energy / maxEnergy) * 100;
	energyFill.style.width = `${energyPercentage}%`;
}

// Function to update bars
function updateBars() {
	updateXPText();
	updateXPBar();
	updateHealthText();
	updateHealthBar();
	updateEnergyText();
	updateEnergyBar();
}

// Classes **********************************************

class Powerup {
	constructor(type) {
		this.type = type;
		this.timeRemaining = 5000;
		this.size = 40;
		this.x = 100;
		this.y = 0;
		this.image = new Image(); // Create an image object for each powerup
		this.setImage(); // Set the image based on the type
		this.loaded = false;
	}

	getImagePath() {
		switch (this.type) {
			case "shield":
				return "shield.png"; // Set the image source for shield powerup
			case "health":
				return "health.png"; // Set the image source for health powerup
			case "speed":
				return "speed.png"; // Set the image source for speed powerup
			default:
				console.log("Invalid powerup type");
		}
	}

	setImage() {
		const imagePath = this.getImagePath();
		this.image.onload = () => {
			console.log(`Image loaded: ${imagePath}`);
			this.loaded = true;
		};
		this.image.src = imagePath;
	}

	draw() {
		if (this.loaded) {
			// Draw the image onto the canvas
			ctx.drawImage(
				this.image,
				this.x - this.size / 2,
				this.y - this.size / 2,
				this.size,
				this.size
			);
		}
	}

	update() {
		// Check for collision with player
		if (
			playerX < this.x + this.size &&
			playerX + playerWidth > this.x &&
			playerY < this.y + this.size &&
			playerY + playerHeight > this.y
		) {
			// Collision detected, apply effect of the powerup
			this.applyEffect();
			// Remove the powerup from the array
			const index = powerups.indexOf(this);
			if (index !== -1) {
				powerups.splice(index, 1);
			}
		}
	}

	applyEffect() {
		switch (this.type) {
			case "shield":
				this.applyShield();
				break;
			case "health":
				this.applyHealth();
				break;
			case "speed":
				this.applySpeed();
				break;
			default:
				console.log("Invalid powerup type");
		}
	}

	applyShield() {
		console.log("shield on");
		shield = true; // Activate god mode for the player

		// Draw shield visual effect on canvas
		const shieldRadius = 30; // Radius of the shield
		const shieldColor = "rgba(0, 255, 255, 0.5)"; // Color of the shield (light blue with transparency)

		// Draw shield on canvas
		ctx.beginPath();
		ctx.arc(playerX, playerY, shieldRadius, 0, Math.PI * 2);
		ctx.fillStyle = shieldColor;
		ctx.fill();
		ctx.closePath();

		// Remove shield visual effect after 10 seconds
		setTimeout(() => {
			console.log("shield off");
			shield = false; // Deactivate god mode
			ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
		}, this.timeRemaining);
	}

	applyHealth() {
		health = Math.min(health + 20, maxHealth); // Increase player's health by 20, capped at maxHealth
	}

	applySpeed() {
		// Increase speed by 5 units
		speed += 5;
		dashDistance += 100;

		// Set a timeout to revert speed back to normal after 10 seconds
		setTimeout(() => {
			dashDistance -= 100;
			speed -= 5; // Decrease speed by 5 units to revert to normal
		}, this.timeRemaining);
	}
}

class Zombie {
	constructor(x, y, radius, color, speed, health) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.sideLength = this.radius * 2;
		this.color = color;
		this.speed = speed;
		this.originalSpeed = speed; // Store the original speed
		this.health = health; // New property to represent zombie's health
		this.maxHealth = health;
		this.originalColor = color; // Store the original color
		this.hue = this.extractHue(color);
		this.poisonIntervals = 0; // Track poison intervals
		this.poisonIntervalID = null; // ID for the poison interval
		this.poisonParticlesIntervalID = null; // ID for the poison particles interval
		this.poisoned = false;
	}

	extractHue(color) {
		// Extract the hue value from the color string
		const regex = /hsl\((\d+),\s*\d+%,\s*\d+%\)/;
		const match = color.match(regex);
		if (match && match.length > 1) {
			return parseInt(match[1]); // Parse the hue value as an integer
		}
		return 0; // Default to 0 if no hue is found
	}

	draw(ctx) {
		ctx.save(); // Save the current transformation state

		// Translate the canvas origin to the zombie's position
		ctx.translate(this.x, this.y);

		// Rotate the canvas to point the zombie towards the player with a 90 degree offset
		ctx.rotate(
			Math.atan2(playerY - this.y, playerX - this.x) + Math.PI / 2
		);

		// Draw the triangle representing the zombie
		ctx.beginPath();
		ctx.moveTo(0, -this.sideLength / 2); // Top point of the triangle
		ctx.lineTo(-this.sideLength / 2, this.sideLength / 2); // Bottom-left corner
		ctx.lineTo(this.sideLength / 2, this.sideLength / 2); // Bottom-right corner
		ctx.closePath();

		// Fill the triangle with the zombie's color
		ctx.fillStyle = this.color;

		ctx.fill();

		ctx.restore(); // Restore the previous transformation state
	}

	move(playerX, playerY, zombies) {
		if (!freeze) {
			// Calculate the angle towards the player
			const angleToPlayer = Math.atan2(
				playerY - this.y,
				playerX - this.x
			);

			// Calculate the movement vector towards the player
			let dx = Math.cos(angleToPlayer) * this.speed;
			let dy = Math.sin(angleToPlayer) * this.speed;

			// Add avoidance vector to the movement vector
			zombies.forEach((zombie) => {
				if (zombie !== this) {
					// Skip self
					const distance = Math.hypot(
						zombie.x - this.x,
						zombie.y - this.y
					);
					if (distance < this.sideLength) {
						// Calculate the angle away from the colliding zombie
						const angleAway = Math.atan2(
							this.y - zombie.y,
							this.x - zombie.x
						);

						// Calculate the avoidance vector
						const avoidanceDx = Math.cos(angleAway) * this.speed;
						const avoidanceDy = Math.sin(angleAway) * this.speed;

						// Add avoidance vector to the movement vector
						dx += avoidanceDx;
						dy += avoidanceDy;
					}
				}
			});

			// Move the zombie by the combined movement vector
			this.x += dx;
			this.y += dy;
		}
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
			this.reduceHealth(5);
		} else {
			this.speed = this.originalSpeed; // Reset speed to its original value
			this.move(playerX, playerY, zombies);
		}

		// Check if the zombie is poisoned and there are remaining intervals
		if (this.poisoned && this.poisonIntervals > 0) {
			// Start spawning poison particles if not already started
			if (!this.poisonParticlesIntervalID) {
				this.poisonParticlesIntervalID = setInterval(() => {
					if (!this.health <= 0) {
						spawnPoisonEffect(this.x, this.y, this);
					}
				}, 300); // Spawn poison particles every 300 milliseconds (adjust as needed)
			}
		} else {
			// Stop spawning poison particles if the zombie is not poisoned or runs out of intervals
			clearInterval(this.poisonParticlesIntervalID);
			this.poisonParticlesIntervalID = null;
			this.poisoned = false; // Reset poisoned flag
		}

		// Check if the zombie's health is zero or less
		if (this.health <= 0) {
			this.poisonIntervals = 0;
			this.poisonIntervalID = null;
			this.poisonParticlesIntervalID = null;
			this.poisoned = false;
			// Stop spawning poison particles if the zombie is not poisoned or runs out of intervals
			clearInterval(this.poisonParticlesIntervalID);
			// Remove the zombie from the game
			this.stopPoisonEffect();
			return true; // Signal that the zombie should be removed
		}

		return false; // Signal that the zombie should not be removed yet
	}

	knockback(knockbackX, knockbackY) {
		// Move the zombie gradually towards its new position after knockback
		const knockbackDistance = Math.sqrt(
			knockbackX * knockbackX + knockbackY * knockbackY
		);
		const knockbackStepX = knockbackX / 4; // Move 1/4 of the distance each step
		const knockbackStepY = knockbackY / 4;

		this.x += knockbackStepX;
		this.y += knockbackStepY;

		// Check if the zombie has reached its new position
		if (knockbackDistance < 5) {
			// Adjust the threshold as needed
			// Zombie has reached its new position, stop knockback
			this.x += knockbackX;
			this.y += knockbackY;
			this.speed = this.originalSpeed; // Reset speed to its original value
			return;
		}

		// Schedule the next step of knockback animation
		requestAnimationFrame(() =>
			this.knockback(
				knockbackX - knockbackStepX,
				knockbackY - knockbackStepY
			)
		);
	}

	reduceHealth(damage) {
		// Reduce zombie health
		this.health -= damage;

		// Calculate the color based on health percentage
		const percentage = this.health / this.maxHealth;
		const darkerColor = this.calculateDarkerColor(
			this.originalColor,
			percentage
		);
		this.color = `hsl(${darkerColor[0]}, ${darkerColor[1]}%, ${darkerColor[2]}%)`;

		// Flash red briefly
		const originalColor = this.color;
		this.color = "white"; // Change color to red

		// Set a timeout to revert back to the original color after 200 milliseconds (adjust as needed)
		setTimeout(() => {
			this.color = originalColor; // Revert back to the original color
		}, 30);

		// Check if health is zero or less
		if (this.health <= 0) {
			// Remove the zombie
			return true; // Signal that the zombie should be removed
		}

		return false; // Signal that the zombie should not be removed
	}

	poison(damage) {
		const intervals = 5; // Default number of intervals

		// Apply poison damage to the zombie immediately
		this.reduceHealth(damage);

		// Check if zombie is already poisoned
		if (this.poisonIntervals <= 0) {
			// Set new poison intervals
			this.poisonIntervals = intervals;

			// Start poison effect
			this.startPoisonEffect(damage);
		} else {
			// Increment remaining intervals
			this.poisonIntervals += 5;
		}
	}

	startPoisonEffect(damage) {
		this.poisoned = true;
		// Apply poison damage to the zombie every interval
		const poisonDamageIntervalID = setInterval(() => {
			this.reduceHealth(damage);
		}, 1000); // Apply damage every second (adjust as needed)

		// Start the poison interval if not already running
		if (!this.poisonIntervalID) {
			this.poisonIntervalID = setInterval(() => {
				this.poisonIntervals--; // Decrease remaining intervals

				// Stop poison effect if intervals reach 0
				if (this.poisonIntervals <= 0) {
					clearInterval(this.poisonIntervalID);
					clearInterval(this.poisonParticlesIntervalID);
					clearInterval(poisonDamageIntervalID); // Stop applying poison damage
					this.poisonIntervalID = null;
					this.poisonParticlesIntervalID = null;
				}
			}, 1000); // Decrease intervals every second (adjust as needed)
		}
	}

	// Function to stop poison effect
	stopPoisonEffect() {
		// Stop spawning poison particles
		clearInterval(this.poisonParticlesIntervalID);
		this.poisonParticlesIntervalID = null;
		this.poisoned = false; // Reset poisoned flag
	}

	calculateDarkerColor(originalColor, percentage) {
		// Parse the original color values
		const [, s, l] = originalColor.match(/\d+/g);

		// Calculate the darker lightness component using the factor
		const darkerL = 100 - percentage * 50; // Adjust the factor (50) for the desired darkness

		// Ensure the lightness doesn't go below 0
		const finalL = Math.max(darkerL, 0);

		// Return the modified color in HSL format
		return [this.hue, s, finalL]; // Use the original hue value
	}
}

class Weapon {
	constructor(
		name,
		penetrationCapacity,
		bulletDamage,
		shootCooldown,
		energyCost,
		bulletColor = "#ffdfa6"
	) {
		this.name = name;
		this.penetrationCapacity = penetrationCapacity;
		this.bulletSpeed = this.calculateBulletSpeed(bulletDamage); // Calculate bullet speed based on damage
		this.bulletDamage = bulletDamage;
		this.shootCooldown = shootCooldown; // New parameter for shoot cooldown
		this.canShoot = true; // Flag to track if the weapon can shoot
		this.energyCost = energyCost;

		// Switch statement to set bullet color based on weapon name
		switch (name) {
			case "Water Gun":
				this.bulletColor = "#4169E1"; // Blue color for water gun
				break;
			// Add cases for other weapons here
			case "Plasma Launcher":
				this.bulletColor = "#ff0000"; // Red color for another weapon
				break;
			// Add more cases as needed
			case "Toxic Terrorist":
				this.bulletColor = "#00ff00"; // Red color for another weapon
				break;
			default:
				this.bulletColor = bulletColor; // Use default color for other weapons
		}
	}

	calculateBulletSpeed(damage) {
		// Determine bullet speed based on damage, considering a non-linear relationship
		const baseSpeed = 19; // Base bullet speed
		const maxDamage = 100; // Maximum damage for the non-linear curve
		const curveFactor = 0.5; // Adjustment factor for the curve

		// Apply non-linear relation
		let bulletSpeed =
			baseSpeed +
			(Math.pow(damage, curveFactor) / Math.pow(maxDamage, curveFactor)) *
				baseSpeed;
		bulletSpeed = bulletSpeed / 2;

		return bulletSpeed;
	}

	fire(playerX, playerY, targetX, targetY) {
		if (energy <= 0 || !this.canShoot) {
			return null; // Cannot shoot if out of bullets or on cooldown
		}

		const bulletSpeedMultiplier = 1.3; // How fast bullets should go

		// Calculate bullet velocity
		const dx = targetX - playerX;
		const dy = targetY - playerY;
		const angle = Math.atan2(dy, dx);
		const velocityX =
			Math.cos(angle) * this.bulletSpeed * bulletSpeedMultiplier;
		const velocityY =
			Math.sin(angle) * this.bulletSpeed * bulletSpeedMultiplier;

		// Create a new bullet object
		const bullet = new Bullet(
			playerX,
			playerY,
			velocityX,
			velocityY,
			10,
			35,
			this.bulletColor,
			this.bulletDamage,
			this.penetrationCapacity,
			this.knockback
		);

		energy -= this.energyCost; // Decrease remaining bullets
		this.canShoot = false; // Set shoot cooldown

		// Start cooldown timer
		setTimeout(() => {
			this.canShoot = true;
		}, this.shootCooldown);

		return bullet; // Return the bullet object
	}
}

class Flamethrower extends Weapon {
	constructor() {
		super("Flamethrower", 10, 5, 10, 10, "#ff0000"); // Name: Flamethrower, No Penetration, Low Bullet Damage, Low Shoot Cooldown, Low Energy Cost, Red Bullets
		this.distance = 200; // Maximum range for the flamethrower effect
		this.arcAngle = Math.PI / 4; // Arc angle for the flamethrower effect (in radians)
	}

	fire(playerX, playerY) {
		if (energy <= 0 || !this.canShoot) {
			return null; // Cannot shoot if out of bullets or on cooldown
		}

		const angle = playerRotation; // Get player's current rotation

		const arcAngle = this.arcAngle; // Arc angle for the flamethrower effect

		energy -= this.energyCost; // Decrease remaining energy

		this.canShoot = false; // Set shoot cooldown

		// Start cooldown timer
		setTimeout(() => {
			this.canShoot = true;
		}, this.shootCooldown);

		// Check collision with zombies within the arc of the circle
		for (let i = 0; i < zombies.length; i++) {
			const zombie = zombies[i];

			// Calculate angle between player and zombie with the offset applied
			const zombieAngle =
				Math.atan2(playerY - zombie.y, playerX - zombie.x) -
				Math.PI / 2;
			// Calculate angle difference between player's facing direction and zombie position
			let angleDifference = Math.abs(angle - zombieAngle);

			// Adjust angle difference based on player's facing direction
			const clockwiseDifference = Math.abs(
				angle - zombieAngle + 2 * Math.PI
			);
			const counterclockwiseDifference = Math.abs(
				angle - zombieAngle - 2 * Math.PI
			);
			angleDifference = Math.min(
				angleDifference,
				clockwiseDifference,
				counterclockwiseDifference
			);

			// Ensure angle difference is within [-PI, PI]
			if (angleDifference > Math.PI) {
				angleDifference = 2 * Math.PI - angleDifference;
			}
			// Calculate distance between player and zombie
			const distanceToZombie = Math.sqrt(
				(zombie.x - playerX) ** 2 + (zombie.y - playerY) ** 2
			);
			// Check if zombie is within the arc of the circle and within maxDistance
			if (
				angleDifference <= arcAngle / 2 &&
				distanceToZombie <= this.distance
			) {
				// Roast the zombie with damage
				zombie.reduceHealth(this.bulletDamage);
			}
		}
	}

	// Function to draw the cone-like effect
	drawCone(x, y, angle, length, width, arcAngle) {
		ctx.save(); // Save the current transformation state

		// Translate the canvas origin to the player's position
		ctx.translate(x, y);

		// Rotate the canvas to align with the player's direction
		ctx.rotate(angle - Math.PI / 2); // Apply an offset of 90 degrees
		// Draw the arc of the circle for the flamethrower effect
		ctx.beginPath();
		ctx.moveTo(0, 0); // Move to the starting point (player's position)
		ctx.arc(0, 0, length, -arcAngle / 2, arcAngle / 2); // Draw the arc of the circle
		ctx.closePath();

		// Fill the arc with a red glow color
		ctx.fillStyle = "rgba(255, 0, 0, 0.7)"; // Adjust the alpha value for transparency
		ctx.fill();

		ctx.restore(); // Restore the previous transformation state
	}
}

class PoisonGun extends Weapon {
	constructor() {
		super("Poison Gun", 1, 10, 100, 5, "#00ff00"); // Name: Poison Gun, Penetration: 1, Bullet Damage: 10 (10 damage per interval), Shoot Cooldown: 100ms, Energy Cost: 5, Bullet Color: Green
	}

	fire(playerX, playerY, targetX, targetY) {
		if (energy <= 0 || !this.canShoot) {
			return null; // Cannot shoot if out of energy or on cooldown
		}

		// Calculate bullet velocity
		const bulletSpeedMultiplier = 1.3; // How fast bullets should go
		const dx = targetX - playerX;
		const dy = targetY - playerY;
		const angle = Math.atan2(dy, dx);
		const velocityX =
			Math.cos(angle) * this.bulletSpeed * bulletSpeedMultiplier;
		const velocityY =
			Math.sin(angle) * this.bulletSpeed * bulletSpeedMultiplier;

		// Create a new bullet object
		const bullet = new Bullet(
			playerX,
			playerY,
			velocityX,
			velocityY,
			10,
			35,
			this.bulletColor,
			this.bulletDamage,
			this.penetrationCapacity
		);

		energy -= this.energyCost; // Decrease remaining energy
		this.canShoot = false; // Set shoot cooldown

		// Start cooldown timer
		setTimeout(() => {
			this.canShoot = true;
		}, this.shootCooldown);

		return bullet; // Return the bullet object
	}
}

class MiniGun extends Weapon {
	constructor() {
		super("Minigun", 3, 10, 200, 100); // Name: MiniGun, Penetration: 1, Bullet Damage: 10, Shoot Cooldown: 200ms, Energy Cost: 100, Bullet Color: Gray
		this.baseEnergyCost = this.energyCost; // Store the base energy cost
		this.baseCooldown = this.shootCooldown; // Store the base shoot cooldown
		this.minEnergyCost = 10;
		this.baseFirerateIncrease = 7; // Base increase in firerate per shot
		this.energyCostDecrease = 1; // Decrease in energy cost per shot
		this.firerateMultiplier = 1; // Multiplier to control the rate of increase of firerate
		this.minCooldown = 50; // Minimum value for shoot cooldown
		this.lastShotTime = Date.now(); // Track the time of the last shot
	}

	fire(playerX, playerY, targetX, targetY) {
		if (energy <= this.energyCost || !this.canShoot) {
			return null; // Cannot shoot if out of energy or on cooldown
		}

		// Calculate bullet velocity
		const dx = targetX - playerX;
		const dy = targetY - playerY;
		const angle = Math.atan2(dy, dx);
		const velocityX = Math.cos(angle) * this.bulletSpeed;
		const velocityY = Math.sin(angle) * this.bulletSpeed;

		// Create a new bullet object
		const bullet = new Bullet(
			playerX,
			playerY,
			velocityX,
			velocityY,
			10,
			35,
			this.bulletColor,
			this.bulletDamage,
			this.penetrationCapacity
		);

		// Decrease energy cost and increase firerate
		this.energyCost -= this.energyCostDecrease;
		this.shootCooldown -= this.baseFirerateIncrease; // Decrease shoot cooldown by base firerate increase

		// Adjust firerate increase multiplier non-linearly
		this.firerateMultiplier *= 1.1; // Increase multiplier exponentially for faster increase

		// Ensure shoot cooldown doesn't go below the minimum value
		if (this.shootCooldown < this.minCooldown) {
			this.shootCooldown = this.minCooldown;
		}
		console.log("fired");
		energy -= this.energyCost; // Decrease remaining energy

		// Update weapon properties for next shot
		this.canShoot = false; // Set shoot cooldown
		this.lastShotTime = Date.now(); // Update last shot time

		// Start cooldown timer
		setTimeout(() => {
			this.canShoot = true;
		}, this.shootCooldown);

		// Ensure energy cost doesn't exceed the base energy cost
		if (this.energyCost > this.baseEnergyCost) {
			this.energyCost = this.baseEnergyCost;
		}
		// Ensure energy cost doesn't exceed the min energy cost
		if (this.energyCost < this.minEnergyCost) {
			this.energyCost = this.minEnergyCost;
		}

		// Ensure shoot cooldown doesn't go above the base cooldown
		if (this.shootCooldown > this.baseCooldown) {
			this.shootCooldown = this.baseCooldown;
		}

		return bullet; // Return the bullet object
	}

	update() {
		// Calculate time elapsed since last shot
		const timeSinceLastShot = Date.now() - this.lastShotTime;

		// If no shots have been fired for a while, adjust firerate and energy cost
		if (timeSinceLastShot >= this.shootCooldown + 100) {
			// Increase energy cost
			this.energyCost += this.energyCostDecrease;

			// Decrease firerate
			this.shootCooldown += 9; // Add 9 to the shoot cooldown

			// Adjust firerate increase multiplier non-linearly
			this.firerateMultiplier *= 0.9; // Decrease multiplier to reduce firerate slower

			// Ensure energy cost doesn't exceed the base energy cost
			if (this.energyCost > this.baseEnergyCost) {
				this.energyCost = this.baseEnergyCost;
			}

			// Ensure shoot cooldown doesn't go above the base cooldown
			if (this.shootCooldown > this.baseCooldown) {
				this.shootCooldown = this.baseCooldown;
			}
		}

		// Calculate glow transparency based on the difference between current firerate and base firerate
		const alpha = 1 - this.shootCooldown / this.baseCooldown; // Invert alpha to increase as firerate decreases

		// Adjust glow color based on firerate
		const minAlpha = 0.2; // Minimum alpha value
		const maxAlpha = 1; // Maximum alpha value
		const alphaRange = maxAlpha - minAlpha; // Range of alpha values
		const red = Math.round(255 * alpha); // Adjust red component based on alpha
		const green = Math.round(255 * (1 - alpha)); // Adjust green component inversely proportional to alpha, starts from yellow
		const blue = 0; // No blue component
		const glowColor = `rgba(${red}, ${green - 50}, ${blue}, ${
			minAlpha + alpha * alphaRange
		})`; // Adjust color and alpha based on firerate

		// Draw glow around bullet spawn point
		const glowWidth = 60; // Adjust as needed
		const glowHeight = 40; // Adjust as needed
		const glowRotation = playerRotation; // Use playerRotation as the rotation angle
		if (alpha > 0) {
			this.drawGlow(
				playerX,
				playerY,
				glowWidth,
				glowHeight,
				glowColor,
				glowRotation
			); // Function to draw glow
		}
	}
	drawGlow(playerX, playerY, width, height, color, playerRotation) {
		// Calculate the position of the rectangle in front of the player
		const offsetX = Math.cos(playerRotation - Math.PI / 2) * 20; // Adjust the distance from the player horizontally
		const offsetY = Math.sin(playerRotation - Math.PI / 2) * 20; // Adjust the distance from the player vertically

		// Calculate the position of the rectangle relative to the player
		const x = playerX + offsetX;
		const y = playerY + offsetY;

		// Save the current canvas state
		ctx.save();

		// Translate to the position of the rectangle
		ctx.translate(x, y);

		// Rotate the canvas
		ctx.rotate(playerRotation);

		// Create radial gradient for the glow effect
		const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, width / 2);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, "transparent");

		// Apply the gradient as fill style
		ctx.fillStyle = gradient;

		// Draw the blurred glow effect
		ctx.fillRect(-width / 2, -height / 2, width, height);

		// Restore the canvas state
		ctx.restore();
	}
}

class AkimboWeapon extends Weapon {
	constructor(
		name,
		penetrationCapacity,
		bulletDamage,
		shootCooldown,
		energyCost
	) {
		super(
			name,
			penetrationCapacity,
			bulletDamage,
			shootCooldown,
			energyCost
		);
	}
	fire(playerX, playerY, targetX, targetY) {
		if (energy <= 0 || !this.canShoot) {
			return null; // Cannot shoot if out of bullets or on cooldown
		}

		const bulletSpeedMultiplier = 1.3; // How fast bullets should go
		const bulletGap = 20; // Gap between the two bullets

		// Calculate angle between player and mouse pointer
		const playerAngle = Math.atan2(targetY - playerY, targetX - playerX);

		// Calculate bullet velocity for the right turret based on player angle
		const velocityXRight =
			Math.cos(playerAngle) * this.bulletSpeed * bulletSpeedMultiplier;
		const velocityYRight =
			Math.sin(playerAngle) * this.bulletSpeed * bulletSpeedMultiplier;

		// Calculate bullet velocity for the left turret based on player angle
		const velocityXLeft =
			Math.cos(playerAngle) * this.bulletSpeed * bulletSpeedMultiplier;
		const velocityYLeft =
			Math.sin(playerAngle) * this.bulletSpeed * bulletSpeedMultiplier;

		// Create a new bullet object for the right turret
		const bulletRight = new Bullet(
			playerX + (Math.cos(playerRotation) * bulletGap) / 2,
			playerY + (Math.sin(playerRotation) * bulletGap) / 2,
			velocityXRight,
			velocityYRight,
			10,
			35,
			this.bulletColor,
			this.bulletDamage,
			this.penetrationCapacity
		);

		// Create a new bullet object for the left turret
		const bulletLeft = new Bullet(
			playerX + (Math.cos(playerRotation + Math.PI) * bulletGap) / 2,
			playerY + (Math.sin(playerRotation + Math.PI) * bulletGap) / 2,
			velocityXLeft,
			velocityYLeft,
			10,
			35,
			this.bulletColor,
			this.bulletDamage,
			this.penetrationCapacity
		);

		energy -= this.energyCost * 2; // Decrease remaining bullets
		this.canShoot = false; // Set shoot cooldown

		// Start cooldown timer
		setTimeout(() => {
			this.canShoot = true;
		}, this.shootCooldown);

		return [bulletRight, bulletLeft]; // Return an array containing both bullet objects
	}
}

class LokiPistol extends Weapon {
	constructor(
		name,
		penetrationCapacity,
		bulletDamage,
		shootCooldown,
		energyCost
	) {
		super(
			name,
			penetrationCapacity,
			bulletDamage,
			shootCooldown,
			energyCost
		);
	}

	fire(playerX, playerY, targetX, targetY) {
		if (energy <= 0 || !this.canShoot) {
			return null; // Cannot shoot if out of bullets or on cooldown
		}

		const bulletSpeedMultiplier = 1.3; // How fast bullets should go

		// Calculate bullet velocity
		const dx = targetX - playerX;
		const dy = targetY - playerY;
		const angle = Math.atan2(dy, dx);
		const velocityX =
			Math.cos(angle) * this.bulletSpeed * bulletSpeedMultiplier;
		const velocityY =
			Math.sin(angle) * this.bulletSpeed * bulletSpeedMultiplier;

		// Create a new bullet object
		const bullet = new Bullet(
			playerX,
			playerY,
			velocityX,
			velocityY,
			10,
			35,
			this.bulletColor,
			this.bulletDamage,
			this.penetrationCapacity,
			this.knockback
		);
		// Reverse bullet
		const reverseBullet = new Bullet(
			playerX,
			playerY,
			-velocityX,
			-velocityY,
			10,
			35,
			this.bulletColor,
			this.bulletDamage,
			this.penetrationCapacity,
			this.knockback
		);

		energy -= this.energyCost; // Decrease remaining bullets
		this.canShoot = false; // Set shoot cooldown

		// Start cooldown timer
		setTimeout(() => {
			this.canShoot = true;
		}, this.shootCooldown);

		return [bullet, reverseBullet]; // Return an array containing both bullet objects
	}
}

class Bullet {
	constructor(
		x,
		y,
		velocityX,
		velocityY,
		width,
		height,
		color,
		damage,
		penetration,
		maxDistance = 1000
	) {
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
		this.bulletWeight = this.damage * 2;
		this.maxDistance = maxDistance; // Maximum distance the bullet can travel
		this.distanceTraveled = 0; // Initialize distance traveled
		this.isPoisonBullet = equippedWeapon.name == "Poison Gun";
	}

	bulletKnockback(zombie) {
		// Calculate the knockback direction (opposite direction of bullet)
		const angle = Math.atan2(this.y - playerY, this.x - playerX);

		// Calculate the knockback distance based on bullet weight (adjust the factor as needed)
		const knockbackDistance = this.bulletWeight * 0.1; // Adjust the factor as needed

		// Calculate the knockback velocity components
		const knockbackX = Math.cos(angle) * knockbackDistance;
		const knockbackY = Math.sin(angle) * knockbackDistance;

		zombie.knockback(knockbackX, knockbackY);
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
		ctx.fillRect(
			-this.width / 2,
			-this.height / 2,
			this.width,
			this.height
		);

		ctx.restore(); // Restore the previous transformation state
	}

	update(zombies) {
		let removeBullet = false;

		// Update bullet position
		this.x += this.velocityX;
		this.y += this.velocityY;

		// Update distance traveled
		this.distanceTraveled += Math.sqrt(
			this.velocityX ** 2 + this.velocityY ** 2
		);

		// Check if the bullet has reached its maximum distance
		if (this.distanceTraveled >= this.maxDistance) {
			removeBullet = true;
		}

		// Check collision with zombies
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
				// Check if the bullet is from the PoisonGun
				if (this.isPoisonBullet) {
					// Call poison method on the zombie
					zombie.poison(this.damage);
				} else {
					// Otherwise, reduce zombie health directly
					zombie.reduceHealth(this.damage);
				}
				// Spawn particles at the collision point
				if (particlesOn === true) {
					spawnParticles(this.x, this.y, this.color, 10);
				}
				// Add zombie to the set of collided zombies
				this.hitZombies.push(zombie);

				// Check if the bullet has reached its penetration limit
				if (this.penetration >= 0) {
					removeBullet = true; // Signal that the bullet should be removed
				}
			}
		}

		return removeBullet; // Signal that the bullet should be removed if too far from the player or collided
	}
}

class Particle {
	constructor(
		x,
		y,
		velocityX,
		velocityY,
		color,
		size,
		shape = "square",
		expansionRate = 1,
		fadeRate = 0.01
	) {
		this.x = x;
		this.y = y;
		this.velocityX = velocityX;
		this.velocityY = velocityY;
		this.color = color;
		this.size = size;
		this.shape = shape; // Added parameter to specify particle shape (default: "square")
		this.opacity = 1; // Initial opacity
		this.fadeRate = fadeRate; // Rate at which the particle fades
		this.expansionRate = expansionRate; // Rate at which the circle particle expands
	}

	draw(ctx) {
		ctx.save(); // Save the current transformation state

		// Set particle color and opacity
		ctx.fillStyle = this.color;
		ctx.globalAlpha = this.opacity;

		// Draw the particle based on its shape
		if (this.shape === "square") {
			// Draw square
			ctx.fillRect(
				this.x - this.size / 2,
				this.y - this.size / 2,
				this.size,
				this.size
			);
		} else if (this.shape === "circle") {
			// Draw circle
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
		}

		ctx.restore(); // Restore the previous transformation state
	}

	update() {
		// Update particle position
		this.x += this.velocityX;
		this.y += this.velocityY;

		// Update particle opacity
		this.opacity -= this.fadeRate;

		// Update circle particle size
		if (this.shape === "circle") {
			this.size += this.expansionRate;
		}

		// Check if opacity is very close to zero
		if (this.opacity < 0.01) {
			// Find the index of this particle in the particles array
			const index = particles.indexOf(this);

			// Remove the particle from the array
			if (index !== -1) {
				particles.splice(index, 1);
			}
		}
	}
}

// Spawn Particles

function spawnParticles(x, y, color, numParticles, randomDirections = true) {
	for (let i = 0; i < numParticles; i++) {
		if (randomDirections) {
			// Generate random velocity for each particle
			const velocityX = (Math.random() - 0.5) * 2; // Random value between -1 and 1
			const velocityY = (Math.random() - 0.5) * 2; // Random value between -1 and 1
			// Create a new particle at the collision point
			const particle = new Particle(x, y, velocityX, velocityY, color, 3); // Adjust size as needed
			// Add the particle to the array
			particles.push(particle);
		}
		if (!randomDirections) {
			// Number of particles
			const numParticles = 10; // Adjust as needed

			// Angle increment between each particle
			const angleIncrement = (2 * Math.PI) / numParticles;

			for (let i = 0; i < numParticles; i++) {
				// Calculate angle for this particle
				const angle = i * angleIncrement;

				// Calculate speed factor (random value between 0.5 and 1.5)
				const speedFactor = Math.random() + 2.5; // Adjust as needed

				// Calculate velocity components based on angle and speed factor
				const velocityX = Math.cos(angle) * speedFactor; // X component
				const velocityY = Math.sin(angle) * speedFactor; // Y component

				// Create a new particle at the collision point
				const particle = new Particle(
					x,
					y,
					velocityX,
					velocityY,
					color,
					3
				); // Adjust size as needed
				// Add the particle to the array
				particles.push(particle);
			}
		}
	}
}
// Function to spawn death effect
function spawnDeathEffect(x, y, zombie) {
	// Create a new particle system for the death effect
	const deathParticles = new Particle(
		x,
		y,
		0,
		0,
		"white",
		zombie.maxHealth / 2,
		"circle"
	);
	spawnParticles(x, y, zombie.originalColor, 25, false);
	// Add the death particles to the particles array
	particles.push(deathParticles);
}

// Function to spawn poison effect
function spawnPoisonEffect(x, y, zombie) {
	if (!zombie.health <= 0 && zombie) {
		// Create a new particle system for the poison effect
		const poisonParticles = new Particle(
			x + Math.random() * 20,
			y + Math.random() * 20,
			0,
			0,
			"rgba(25, 179, 2, 0.4)",
			80,
			"circle",
			0.05,
			0.05
		); // Adjust particle properties as needed
		// Spawn poison particles at the zombie's position
		// Add the poison particles to the particles array
		particles.push(poisonParticles);
	}
}

// Make the weapons **************************************

// Dev only weapons
const AK_47 = new Weapon("AK-47", 3, 40, 120, 15);
const SMG = new Weapon("SMG", 3, 20, 50, 5);
const Pistol = new Weapon("Pistol", 2, 50, 200, 10);
const Sniper = new Weapon("Sniper", 5, 200, 500, 20);
const Death = new Weapon("Death", 100, 1000, 0.01, 0);
const DevWeapon = new Weapon("DevGun", 100, 100, 10, 0);

const weapons = [
	(Filler = "Arrays start at index 0 Cus computer wierd"),
	//godray = new Weapon("Small Bullet", 10, 2, 5, 2), // Desc: Harness the power of photons to zap your foes with extra energy. Warning: May cause envy among non-laser gun users.
	//toxic_terrorist = new PoisonGun(),
	//Weapon7 = new Flamethrower(6, 150, 30), // Create a new Flamethrower instance

	//Weapon1 = new Weapon("Temu Gun", 1, 10, 400, 5),  // Desc: Literal trash. Does this even hurt?
	//Weapon2 = new Weapon("Water Gun", 1, 3, 75, 10), // Desc: Useful for watering plants and annoying siblings. Not so much for combat.
	//Weapon3 = new Weapon("Pistol", 2, 15, 200, 10), // Desc: Your classic firearm. Effective but lacks pizzazz.
	(LokiPistol = new LokiPistol("Loki Pistol", 2, 15, 200, 10)),
	(AkimboPistols = new AkimboWeapon("Akimbo Pistol", 2, 15, 200, 10)), // Add AkimboPistols here
	(Weapon4 = new Weapon("Neon Blaster", 3, 20, 300, 15)), // Desc: The neon-infused upgrade to your traditional pistol. Now your enemies can see you coming from a mile away!
	(Weapon5 = new Weapon("Photon Phaser", 4, 25, 250, 20)), // Desc: Harness the power of photons to zap your foes with extra energy. Warning: May cause envy among non-laser gun users.
	(Weapon6 = new Weapon("Blast-O-Matic 5000", 5, 30, 200, 25)), // Desc: Step up your game with the Blast-O-Matic 5000. It's like fireworks, but for combat!
	(minigun = new MiniGun()),
	(Weapon9 = new Weapon("Infinity Ionizer", 8, 45, 50, 40)), // Desc: With the Infinity Ionizer, the only limit is
];

const descriptions = [
	(Filler = "Arrays start at index 0 Cus computer wierd"),
	(LokiPistol = "Lokie Pistol - Follow me, if you dare!"),
	(Weapon1 = "Temu Gun - Literal trash. Does this even hurt?"),
	(Weapon2 =
		"Water Gun - Useful for watering plants. Not so much for combat."),
	(Weapon3 =
		"Pistol - Your classic firearm. Simple, effective, and a little dull. Just like its owner."),
	(Weapon4 =
		"Neon Blaster - An upgrade to your traditional pistol. Warning: May cause temporary blindness. Or permanent. It's like fireworks, but for combat!"),
	(Weapon5 =
		"Plasma Launcher - Roast your enemies and leave them physically and mentally damaged. One shot, one galaxy. Jk jk, but its close!"),
	(Weapon6 =
		"Whats this? Leave enemies scratching their heads ... if they still have them."),
	(Weapon7 =
		"Toxic Terrorist - Chokes enemies with toxic fumes. Smells nice ..."),
];

let equippedWeapon = weapons[1];
//let equippedWeapon = Death;

// Ending + start the game loop  ***********************

function endGame() {
	// Perform actions to end the game, such as displaying a game over message, resetting variables, etc.
	alert("Game Over! Zombies KIlled:" + zombiesKilled);
	init();
}

function spawnZombie(size, color, speed, health) {
	if (!freeze) {
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
			const newZombie = new Zombie(x, y, size, color, speed, health);
			zombies.push(newZombie);
		}
	}
} // hsl(272, 100%, 66%)

// Call spawnZombie periodically using setInterval
setInterval(() => {
	spawnZombie(20, "hsl(0, 70%, 50%)", 2, 100); // Pass arguments as needed
}, 1000); // Spawns a zombie every 5 seconds (adjust as needed)
setInterval(spawnRandomPowerup, 5000); // Spawns a zombie every 5 seconds (adjust as needed)

init();

// new class
class Gun {}
