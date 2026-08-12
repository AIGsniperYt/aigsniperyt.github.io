const canvas = document.getElementById('neuronet');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const palettes = {
  light: {
    backgroundGradientStart: '#FF4EC6',
    backgroundGradientEnd: '#00F9E3',
    nodeFill: '#FFFFFF',
    lineBase: '#FFFFFF',
    lineGradientPower: 1.5
  },
  dark: {
    backgroundGradientStart: '#111827',
    backgroundGradientEnd: '#1F2937',
    nodeFill: '#2C3345',
    lineBase: '#6C9EDB',
    lineGradientPower: 2.2
  }
};

let currentTheme = 'dark';
let palette = palettes[currentTheme];

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  palette = palettes[currentTheme];
  document.body.classList.toggle('light-theme');
}

const bgCanvas = document.createElement('canvas');
const bgCtx = bgCanvas.getContext('2d');
bgCanvas.width = canvas.width;
bgCanvas.height = canvas.height;

const gradient = bgCtx.createLinearGradient(0, 0, bgCanvas.width, bgCanvas.height);
gradient.addColorStop(0, palettes.light.backgroundGradientStart);
gradient.addColorStop(1, palettes.light.backgroundGradientEnd);
bgCtx.fillStyle = gradient;
bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

const bgCanvasDark = document.createElement('canvas');
const bgCtxDark = bgCanvasDark.getContext('2d');
bgCanvasDark.width = canvas.width;
bgCanvasDark.height = canvas.height;

const gradientDark = bgCtxDark.createLinearGradient(0, 0, bgCanvasDark.width, bgCanvasDark.height);
gradientDark.addColorStop(0, palettes.dark.backgroundGradientStart);
gradientDark.addColorStop(1, palettes.dark.backgroundGradientEnd);
bgCtxDark.fillStyle = gradientDark;
bgCtxDark.fillRect(0, 0, bgCanvasDark.width, bgCanvasDark.height);

let nodes = [];
const nodeCount = 92;
const maxDist = 150;
const separationStrength = 0.02;
const edgeRepulsionStrength = 0.01;
const edgeBuffer = 50;

const cellSize = maxDist;
let grid = {};
let gridWidth, gridHeight;

function resetGrid() {
  grid = {};
  gridWidth = Math.ceil(canvas.width / cellSize);
  gridHeight = Math.ceil(canvas.height / cellSize);
}

function getCellIndex(x, y) {
  return `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
}

class Node {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.maxConnections = Math.floor(Math.random() * 3) + 3;
    this.radius = 2 + Math.random() * 2;
  }

  update() {
    let moveX = 0, moveY = 0;
    const cellX = Math.floor(this.x / cellSize);
    const cellY = Math.floor(this.y / cellSize);
    let nearbyNodes = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        if (grid[key]) {
          nearbyNodes.push(...grid[key]);
        }
      }
    }

    for (let other of nearbyNodes) {
      if (other === this) continue;
      let dx = other.x - this.x;
      let dy = other.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.01 && dist < maxDist) {
        let force = separationStrength * (1 / dist) * (1 - dist / maxDist);
        moveX -= dx * force;
        moveY -= dy * force;
      }
    }

    if (this.x < edgeBuffer) moveX += edgeRepulsionStrength * (1 - this.x / edgeBuffer);
    if (this.x > canvas.width - edgeBuffer) moveX -= edgeRepulsionStrength * ((this.x - (canvas.width - edgeBuffer)) / edgeBuffer);
    if (this.y < edgeBuffer) moveY += edgeRepulsionStrength * (1 - this.y / edgeBuffer);
    if (this.y > canvas.height - edgeBuffer) moveY -= edgeRepulsionStrength * ((this.y - (canvas.height - edgeBuffer)) / edgeBuffer);

    if (mouse.x !== undefined && mouse.y !== undefined) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50 && dist > 0.01) {
        let force = 0.5 * (1 - dist / 50);
        moveX += (dx / dist) * force;
        moveY += (dy / dist) * force;
      }
    }

    const randomDrift = 0.02;
    this.vx += moveX + (Math.random() - 0.5) * randomDrift;
    this.vy += moveY + (Math.random() - 0.5) * randomDrift;

    const maxSpeed = 0.6;
    let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) { this.x = 0; this.vx *= -1; }
    if (this.x > canvas.width) { this.x = canvas.width; this.vx *= -1; }
    if (this.y < 0) { this.y = 0; this.vy *= -1; }
    if (this.y > canvas.height) { this.y = canvas.height; this.vy *= -1; }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = palette.nodeFill;
    ctx.fill();
  }
}

function buildGrid() {
  resetGrid();
  for (const node of nodes) {
    const key = getCellIndex(node.x, node.y);
    if (!grid[key]) grid[key] = [];
    grid[key].push(node);
  }
}

function connectNodes() {
  buildGrid();
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const cellX = Math.floor(a.x / cellSize);
    const cellY = Math.floor(a.y / cellSize);
    let candidates = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        if (grid[key]) {
          candidates.push(...grid[key]);
        }
      }
    }

    candidates = candidates.filter(n => n !== a)
      .map(b => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return { node: b, dist };
      });

    let neighbors = candidates.filter(c => c.dist < maxDist);
    let farNeighbors = candidates.filter(c => c.dist >= maxDist && c.dist < maxDist * 2);

    neighbors.sort((n1, n2) => n1.dist - n2.dist);
    farNeighbors.sort((n1, n2) => n1.dist - n2.dist);

    neighbors = neighbors.slice(0, a.maxConnections);
    if (farNeighbors.length > 0) {
      neighbors.push(farNeighbors[0]);
    }

    for (let { node: b, dist } of neighbors) {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = hexToRgba(palette.lineBase, 0.5 * (1 - dist / maxDist));
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function animate() {
  ctx.drawImage(currentTheme === 'dark' ? bgCanvasDark : bgCanvas, 0, 0);
  nodes.forEach(node => {
    node.update();
    node.draw();
  });
  connectNodes();
  requestAnimationFrame(animate);
}

function init() {
  nodes = [];
  resetGrid();
  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new Node());
  }
  animate();
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

const mouse = {};
canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
canvas.addEventListener('mouseleave', () => {
  delete mouse.x;
  delete mouse.y;
});

document.addEventListener("DOMContentLoaded", () => {
  init();
  document.body.classList.add(currentTheme + "-theme");
});

// Typing billboard logic
let content = "";
let charLimit = 300;

const display = document.getElementById("display");
const inputField = document.createElement("textarea");
inputField.id = "hiddenInput";
inputField.autofocus = true;
document.body.appendChild(inputField);

Object.assign(inputField.style, {
  position: "absolute",
  opacity: "0",
  pointerEvents: "none",
  zIndex: "-1"
});


inputField.addEventListener("input", () => {
  let content = inputField.value;

  if (content.length > charLimit && content.endsWith("\n")) {
    inputField.value = "";
    display.innerText = "";
    return;
  }

  display.innerText = content;
});

document.addEventListener("click", () => inputField.focus());
document.addEventListener("keydown", (e) => {
// Replace the clearContentAnimated() call with:
if (e.ctrlKey && e.shiftKey && e.code === "KeyC") {
  display.textContent = "✂️ AIGsniper's App ✂️";
  setTimeout(() => {
    clearContentAnimated();
  }, 1000);
  e.preventDefault();
}

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    content += e.key;
  } else if (e.key === "Enter") {
    if (content.length >= charLimit) {
      content = "";
    } else {
      content += "\n"; // Use real newline here
    }
  } else if (e.key === "Backspace") {
    content = content.slice(0, -1);
  }
  document.getElementById("display").textContent = content;
});
function clearContentAnimated() {
  if (content.length > 0) {
    content = content.slice(0, -1);
    inputField.value = content; // keep input field in sync
    display.textContent = content;
    requestAnimationFrame(clearContentAnimated);
  }
}



