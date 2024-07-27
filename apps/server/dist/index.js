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
const ws_1 = require("ws");
const redis_1 = require("redis");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(cookieParser());
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
const port = process.env.PORT || 4000;
const subscriber = (0, redis_1.createClient)();
const publisher = (0, redis_1.createClient)();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield publisher.connect();
        yield subscriber.connect();
        console.log('Redis connected');
    }
    catch (err) {
        console.error('Failed to connect to Redis', err);
    }
}))();
wss.on('connection', (ws) => {
    console.log('New Client Connection');
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(message);
        if (data.type === 'SUBSCRIBE') {
            const { channel } = data;
            yield subscriber.SUBSCRIBE(channel, (message) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(`Recievd message ${message} on ${channel}`);
                ws.send(message);
            }));
        }
        else if (data.type === 'PUBLISH') {
            const { channel, message } = data;
            yield publisher.PUBLISH(channel, message);
            console.log(`PUBLISHED ${message} TO ${channel}`);
        }
        else if (data.type === 'UNSUBSCRIBE') {
            const { channel } = data;
            yield subscriber.UNSUBSCRIBE(channel);
            console.log(`UBSUBSCRIBED ${channel}`);
        }
        else {
            console.log(data);
        }
    }));
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
