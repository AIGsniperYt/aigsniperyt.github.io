import { trees, player, canvas, } from './main.js';

export let isUpPressed = false;
export let isDownPressed = false;
export let isLeftPressed = false;
export let isRightPressed = false;

let mouseX, mouseY;

// Function to handle mousemove event
function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

// Add event listener after canvas declaration
window.addEventListener("mousemove", handleMouseMove);
export const speed = 50;

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


export function updatePlayerPositions() {
    const combinedSpeed = speed;

    // Calculate movement components
    const moveX = (isLeftPressed ? 1 : 0) - (isRightPressed ? 1 : 0);
    const moveY = (isUpPressed ? 1 : 0) - (isDownPressed ? 1 : 0);

    // Normalize the vector
    const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);

    // Ensure the magnitude is not zero to avoid division by zero
    if (magnitude !== 0) {
        const normalizedMoveX = moveX / magnitude;
        const normalizedMoveY = moveY / magnitude;

        // Apply normalized movement with proper direction
        for (const tree of trees) {
            tree.x += normalizedMoveX * combinedSpeed;
            tree.y += normalizedMoveY * combinedSpeed;
        }
    }

    // Check for collision with trees
    for (const tree of trees) {
        const distance = Math.sqrt((player.x - tree.x) ** 2 + (player.y - tree.y) ** 2);
        const collisionDistance = player.width / 2 + tree.size / 2;

        if (distance < collisionDistance) {
            //console.log("Collision with a tree!");
            // You can add additional logic here, such as reducing player health or removing the tree
        }
    }


    // Set the player's position to the center of the canvas
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    // Calculate angle between player and mouse pointer
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

    // Convert angle to degrees and update player rotation
    player.rotation = angle * (180 / Math.PI) + 90; // Add 90 degrees to account for the initial offset
}