"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = require("http");
const uuid_1 = require("uuid");
const server = (0, http_1.createServer)((request, response) => {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.end("Hi there!");
});
const wss = new ws_1.WebSocketServer({ server });
const clients = new Map(); // Map to store user IDs and WebSocket instances
wss.on('connection', (ws) => {
    // Assign a unique ID to the user for this connection
    const userId = (0, uuid_1.v4)();
    clients.set(userId, ws);
    console.log(`User connected with ID: ${userId}`);
    // Send the user their unique ID (could be used for client-side reference)
    ws.send(JSON.stringify({ type: 'user-id', userId }));
    ws.on('message', (message) => {
        var _a;
        try {
            const data = JSON.parse(message);
            const { recipient, content } = data;
            console.log(`Message from ${userId} to ${recipient}: ${content}`);
            if (clients.has(recipient)) {
                (_a = clients.get(recipient)) === null || _a === void 0 ? void 0 : _a.send(content);
            }
            else {
                console.log(`Recipient ${recipient} is not connected.`);
            }
        }
        catch (error) {
            console.error('Failed to parse message', error);
        }
    });
    ws.on('close', () => {
        // Remove client from clients map on close
        clients.delete(userId);
        console.log(`User ${userId} disconnected.`);
    });
});
server.listen(8080, () => {
    console.log((new Date()) + ' Server is listening on port 8080');
});
