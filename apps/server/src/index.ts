import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use(express.urlencoded({ extended: true}));
// app.use(cookieParser());
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
    const data = JSON.parse(message);
    if (data.type === 'SUBSCRIBE') {
      const { channel } = data;
      await subscriber.SUBSCRIBE(channel, async (message) => {
        console.log(`Recievd message ${message} on ${channel}`);
        ws.send(message);
      });
    } else if (data.type === 'PUBLISH') {
      const { channel, message } = data;
      await publisher.PUBLISH(channel, message);
      console.log(`PUBLISHED ${message} TO ${channel}`);
    } else if (data.type === 'UNSUBSCRIBE') {
      
      const { channel } = data;
      await subscriber.UNSUBSCRIBE(channel);
      console.log(`UBSUBSCRIBED ${channel}`);
    } else {
      console.log(data);
    }
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
