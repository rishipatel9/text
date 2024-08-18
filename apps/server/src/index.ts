import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';
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
    try {
      let Data = JSON.parse(message);
      console.log(Data);

      if (Data.type === 'SUBSCRIBE') {
        for (let chatId of Data.chatIds) {
          chatId = chatId.toString();
          await subscriber.subscribe(chatId, (message) => {
            console.log(`Message received on channel ${chatId}:`, message);
            ws.send(JSON.stringify({
              channel: chatId,
              message: message,
              user: Data.user,
            }));
          });
        }
      } else if (Data.type === 'PUBLISH') {
        console.log("from publish at 57:", Data);
        const chatId = Data.chatId.toString();
        await publisher.publish(chatId, JSON.stringify(Data));
        console.log("published");
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
