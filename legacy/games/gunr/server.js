const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server to serve the HTML
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading file');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
    const userId = Math.random().toString(36).substr(2, 8); // Generate a random user ID
    clients.push({ ws, userId });

    console.log(`New client connected with ID: ${userId}`);

    // Listen for incoming messages
    ws.on('message', (message) => {
        const userTag = userId.slice(0, 2).toUpperCase(); // Get the first 2 letters of the user ID
        const broadcastMessage = `${userTag}: ${message}`;
        console.log(`Received: ${broadcastMessage}`);

        clients.forEach(client => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(broadcastMessage);
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log(`Client with ID: ${userId} disconnected.`);
        clients = clients.filter(client => client.ws !== ws);
    });
});

// Listen on port 8080 for HTTP and WebSocket connections
server.listen(8080, () => {
    console.log('Server is listening on http://localhost:8080');
});
