import { wsUrl } from "./config";

type MessageHandler = (message: MessageEvent) => void;

class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket;
  private initialized: boolean = false;
  private messageHandlers: Set<MessageHandler>;

  private constructor() {
    this.ws = new WebSocket(wsUrl);
    this.messageHandlers = new Set();
    this.initialized = true;
    this.init();
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }
  init() {
    this.ws.onopen = () => {
      this.initialized = true;
    };
    this.ws.onmessage = (event) => {
      console.log(event);
    };
  }

  public sendMessage(message: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Unable to send message.");
    }
  }

  public addMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.add(handler);
  }

  public removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }
}

export default WebSocketManager;
