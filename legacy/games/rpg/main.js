import { resources } from "./resources.js";
import * as movement from './movement.js';


export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

window.day = false;
window.AAA = false;

// muse was here

class Tree {
    constructor() {
        this.x = Math.floor(Math.random() * 10001); // Random x position from 0 to 1000
        this.y = Math.floor(Math.random() * 10001); // Random y position from 0 to 1000
        this.health = Math.floor(Math.random() * (200 - 50 + 1) + 50); // Random health between 50 and 200
        this.wood = this.health; // Set wood equal to health
        this.size = (this.health * 2); // Set size equal to health
        this.dayImg = resources.images.treeDay.image.src;
        this.nightImg = resources.images.treeNight.image.src;
        this.badDay = resources.images.badDay.image.src;
        this.badNight = resources.images.badNight.image.src;
    }

    // You can add more methods or properties specific to trees if necessary
}

// Create an array to hold the trees
export const trees = [];

// Generate 500 trees
for (let i = 0; i < 500; i++) {
    trees.push(new Tree());
}

// Set initial canvas size
resizeCanvas();

// Function to resize the canvas based on the window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Update canvas size when the window is resized
window.addEventListener("resize", resizeCanvas);

let gameEnded = false;
let gameStarted = true;

// movement was here

export const player = {
    img: resources.images.player.image,
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 100, // Adjust the width of the image
    height: 100, // Adjust the height of the image
    rotation: 0, // where player is pointing
};


ctx.imageSmoothingEnabled = true; // toggle pixelation



function gameLoop() {
    movement.updatePlayerPositions();
    drawCanvas();
    requestAnimationFrame(gameLoop)
}


// update player positions was here


function drawCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the green background
    ctx.fillStyle = '#00FF00'; // Green color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save the current context state before rotating
    ctx.save();

    // Rotate the context based on player rotation
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation * (Math.PI / 180));

    // Draw the player image at the rotated position
    ctx.drawImage(player.img, -player.width / 2, -player.height / 2, player.width, player.height);

    // Restore the context state after drawing
    ctx.restore();

    // Draw the trees with day images at their updated positions
    for (const tree of trees) {
        const img = new Image();
        if (day) {
            if (AAA) {
                img.src = tree.dayImg;
            }
            else {
                img.src = tree.badDay
            }

        }
        else {
            if (AAA) {
                img.src = tree.nightImg;
            }
            else {
                img.src = tree.badNight;
            }
        }

        ctx.drawImage(img, tree.x - tree.size / 2, tree.y - tree.size / 2, tree.size, tree.size);
    }
}

gameLoop()
