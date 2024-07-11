"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
const subscriber = (0, redis_1.createClient)();
const publisher = (0, redis_1.createClient)();
const createConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield publisher.connect();
        yield subscriber.connect();
        console.log("Redis connected");
    }
    catch (err) {
        console.error("Failed to connect to Redis", err);
    }
});
createConnection();
const port = process.env.PORT || 4000;
const clientChannels = new Map();
// (async () => {
//   await subscriber.connect();
//   await publisher.connect();
// })();
wss.on('connection', (ws) => __awaiter(void 0, void 0, void 0, function* () {
    ws.channels = new Set();
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'subscribe') {
            const { channel } = parsedMessage;
            console.log(`Subscribed to ${channel}`);
            subscriber.subscribe(channel, (err, count) => {
                if (err) {
                    console.error(`Failed to subscribe: ${err}`);
                }
                else {
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
                }
                else {
                    console.log(`Unsubscribed from ${count} channel(s).`);
                }
            });
            ws.channels.delete(channel);
            if (ws.channels.size === 0) {
                clientChannels.delete(ws);
            }
            else {
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
                }
                else {
                    console.log(`Unsubscribed from ${count} channel(s).`);
                }
            });
        });
    });
}));
subscriber.on('message', (channel, message) => {
    wss.clients.forEach((client) => {
        const typedClient = client;
        if (clientChannels.has(typedClient) &&
            clientChannels.get(typedClient).has(channel) &&
            typedClient.readyState === ws_1.default.OPEN) {
            typedClient.send(message);
        }
    });
});
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
