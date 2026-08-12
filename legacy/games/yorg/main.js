// Section: Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

if (!canvas || !ctx) {
    console.error('Canvas or context could not be initialized.');
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Section: Map Dimensions and Tiles
const width = 200;
const height = 200;

const crystal_nodes = 300;
const wood_nodes = 500;
const iron_nodes = 300;
const diamond_nodes = 150;
const uranium_nodes = 300;

const map = new Map();

let gems = 100;
let gemsPerSecond = 0;

const minTileSize = 20;
const maxTileSize = 65;
let tileSize = Math.max(minTileSize, Math.min(maxTileSize, Math.min(canvas.width / width, canvas.height / height)));

let selectedNode = null;

// Node costs (gems spent to place) and rewards (gems earned when mined)
const nodeConfig = {
    crystal_node: { color: '#8142f5', cost: 5, reward: 10 },
    wood_node: { color: '#4a8e2a', cost: 2, reward: 4 },
    iron_node: { color: '#9aa0a6', cost: 8, reward: 15 },
    diamond_node: { color: '#4ae0ff', cost: 15, reward: 30 },
    uranium_node: { color: '#aaff00', cost: 40, reward: 80 },
};

// Populate the map with all node types at unique positions
const setTile = (x, y, value) => map.set(`${x},${y}`, value);

const placeNodes = (count, type) => {
    let placed = 0;
    while (placed < count) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const key = `${x},${y}`;
        if (!map.has(key)) {
            map.set(key, type);
            placed++;
        }
    }
};

placeNodes(crystal_nodes, 'crystal_node');
placeNodes(wood_nodes, 'wood_node');
placeNodes(iron_nodes, 'iron_node');
placeNodes(diamond_nodes, 'diamond_node');
placeNodes(uranium_nodes, 'uranium_node');

// Section: Rendering Functions
const drawMap = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const borderThickness = 0.01 * tileSize;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tileValue = map.get(`${x},${y}`);
            fillTiles(tileValue);
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            ctx.lineWidth = borderThickness;
            ctx.strokeStyle = 'grey';
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    drawCurrencyCounter();
};

const fillTiles = (tileValue) => {
    if (tileValue && nodeConfig[tileValue]) {
        ctx.fillStyle = nodeConfig[tileValue].color;
    } else {
        ctx.fillStyle = '#333';
    }
};

const drawCurrencyCounter = () => {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    const hint = selectedNode ? ` | Building: ${selectedNode.replace('_node', '')} (cost ${nodeConfig[selectedNode].cost}, click an empty tile)` : ' | Open the Build menu to place nodes';
    ctx.fillText(`Gems: ${gems}${hint}`, 10, 30);
};

// Section: Node Selection
const setSelectedNode = (node) => {
    selectedNode = node;
    document.querySelectorAll('.node-button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.node === node);
    });
};

document.querySelectorAll('.node-button').forEach((btn) => {
    btn.addEventListener('click', () => setSelectedNode(btn.dataset.node));
});

// Section: Tile Click handler
const handleTileClick = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / tileSize);
    const y = Math.floor((event.clientY - rect.top) / tileSize);
    const key = `${x},${y}`;

    if (map.has(key)) {
        // Mine the existing node for gems
        const minedType = map.get(key);
        const reward = nodeConfig[minedType].reward;
        gems += reward;
        map.delete(key);
        drawMap();
        return;
    }

    // Place a selected node on an empty tile
    if (selectedNode && gems >= nodeConfig[selectedNode].cost) {
        map.set(key, selectedNode);
        gems -= nodeConfig[selectedNode].cost;
        drawMap();
    } else if (selectedNode) {
        console.log(`Not enough gems to place ${selectedNode} (need ${nodeConfig[selectedNode].cost})`);
    }
};

// Initial draw call to render the map
drawMap();

canvas.addEventListener('click', handleTileClick);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tileSize = Math.max(minTileSize, Math.min(maxTileSize, Math.min(canvas.width / width, canvas.height / height)));
    drawMap();
});

canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
        tileSize = Math.min(maxTileSize, tileSize + 5);
    } else {
        tileSize = Math.max(minTileSize, tileSize - 5);
    }
    drawMap();
});