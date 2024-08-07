import { wsUrl } from "./config";

type MessageHandler = (message: MessageEvent) => void;

class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket;
  private initialized: boolean = false;
  private messageHandlers: Set<MessageHandler>;

  private constructor(private signalingString?: string) {
    this.ws = new WebSocket(signalingString || wsUrl);
    this.messageHandlers = new Set();
    this.init();
  }

  public static getInstance(): WebSocketManager {
    if (!this.instance) {
      this.instance = new WebSocketManager(wsUrl);
    }
    return this.instance;
  }
  init() {
    this.ws.onopen = () => {
      console.log("ws Connected :WebSocketManager");
      this.initialized = true;
    };
    this.ws.onmessage = (event) => {
      console.log(event?.data);
    };
  }

  sendMessage(message: object): void {
    // console.log(`Message to send : ${message}`);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Unable to send message.");
    }
  }
}

export default WebSocketManager;
