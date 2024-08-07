import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';
import axios from 'axios';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 4000;
const subscriber = createClient();
const publisher = createClient();

(async () => {
  try {
    await publisher.connect();
    await subscriber.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('Failed to connect to Redis', err);
  }
})();


wss.on('connection', (ws) => {
  console.log('New Client Connection');
  

  ws.on('message', async (message: string) => {
    let Data=JSON.parse(message);
    console.log(Data);
    if(Data.type==='SUBSCRIBE'){
      console.log("inside subscribe");
      for (let chatId of Data.chatIds) {
        chatId = chatId.toString(); 
        console.log(`SUBSCRIBED TO: ${chatId}`);
        await subscriber.subscribe(chatId, async (message) => {
          console.log(`Message received on channel ${chatId}:`, message);
          ws.send(JSON.stringify({
            channel: chatId,
            message: message
          }))
        });
      }
    }
    else if(Data.type==='PUBLISH'){
        const chatId=(Data.chatId).toString()
        const message=Data.message
        console.log(message);
        console.log(chatId);
        await publisher.publish(chatId,message);
        console.log("published");
        
    }
    
    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(Data);
    //   }
    // });
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
