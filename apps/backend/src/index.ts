import { WebSocketServer, WebSocket } from 'ws';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';

interface MessageData {
    recipient: string;
    content: string;
    sender:string
}

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.end("Hi there!");
});

const wss = new WebSocketServer({ server });
const clients = new Map<string, WebSocket>(); // Map to store user IDs and WebSocket instances

wss.on('connection', (ws: WebSocket) => {
    // Assign a unique ID to the user for this connection

    
    // Send the user their unique ID (could be used for client-side reference)
    // ws.send(JSON.stringify({ type: 'user-id', userId }));
    
    ws.on('message', (message: string) => {
      try {
        const data: MessageData = JSON.parse(userId,message);
        console.log(`User connected with ID: ${userId}`);
            const { recipient, content , } = data;
            console.log(`Message from ${userId} to ${recipient}: ${content}`);

            if (clients.has(recipient)) {
                clients.get(recipient)?.send(content);
            } else {
                console.log(`Recipient ${recipient} is not connected.`);
            }
        } catch (error) {
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
