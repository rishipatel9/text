import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import  { createClient } from 'redis';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const subscriber = createClient();
const publisher = createClient();
const createConnection = async ()=>{
    try{
        await publisher.connect();
        await subscriber.connect();
        console.log("Redis connected");
    }catch(err){
        console.error("Failed to connect to Redis",err);
    }
}
createConnection();
const port = process.env.PORT || 4000;

interface WebSocketWithChannels extends WebSocket {
  channels: Set<string>;
}

const clientChannels = new Map<WebSocketWithChannels, Set<string>>();


wss.on('connection', async (ws: WebSocketWithChannels) => {
  ws.channels = new Set();

  ws.on('message', (message: string) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'subscribe') {
      const { channel } = parsedMessage;
      console.log(`Subscribed to ${channel}`);
      subscriber.subscribe(channel, (err, count) => {
        if (err) {
          console.error(`Failed to subscribe: ${err}`);
        } else {
          console.log(`Subscribed to ${count} channel(s).`);
        }
      });
      ws.channels.add(channel);
      clientChannels.set(ws, ws.channels);
    }

    if (parsedMessage.type === 'unsubscribe') {
      const { channel } = parsedMessage;
      console.log(`Unsubscribed from ${channel}`);
      subscriber.unsubscribe(channel, (err, count) => {
        if (err) {
          console.error(`Failed to unsubscribe: ${err}`);
        } else {
          console.log(`Unsubscribed from ${count} channel(s).`);
        }
      });
      ws.channels.delete(channel);
      if (ws.channels.size === 0) {
        clientChannels.delete(ws);
      } else {
        clientChannels.set(ws, ws.channels);
      }
    }

    if (parsedMessage.type === 'sendMessage') {
      const { channel, message } = parsedMessage;
      console.log(`Sending message to ${channel}: ${message}`);
      publisher.publish(channel, message);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clientChannels.delete(ws);
    ws.channels.forEach((channel) => {
      subscriber.unsubscribe(channel, (err, count) => {
        if (err) {
          console.error(`Failed to unsubscribe: ${err}`);
        } else {
          console.log(`Unsubscribed from ${count} channel(s).`);
        }
      });
    });
  });
});

subscriber.on('message', (channel: string, message: string) => {
  wss.clients.forEach((client) => {
    const typedClient = client as WebSocketWithChannels;
    if (
      clientChannels.has(typedClient) &&
      clientChannels.get(typedClient)!.has(channel) &&
      typedClient.readyState === WebSocket.OPEN
    ) {
      typedClient.send(message);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
