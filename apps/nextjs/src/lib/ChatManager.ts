import axios from "axios";
import WebSocketManager from "./WebSocketManager";
import { CURRENT_USER, MESSAGE } from "@/lib/types";

export class ChatManager {
  private sessionUser: string;
  private newId: number;
  private setMessages: React.Dispatch<React.SetStateAction<MESSAGE[]>>;
  private setFetching: React.Dispatch<React.SetStateAction<boolean>>;

  constructor(
    sessionUser: string,
    newId: number,
    setMessages: React.Dispatch<React.SetStateAction<MESSAGE[]>>,
    setFetching: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    this.sessionUser = sessionUser;
    this.newId = newId;
    this.setMessages = setMessages;
    this.setFetching = setFetching;

    WebSocketManager.getInstance();
  }

  async displayChats(
    imageUrl: string,
    name: string,
    id: number,
    providerId: string,
    setCurrentUser: React.Dispatch<React.SetStateAction<CURRENT_USER | null>>,
    setChatRoom: React.Dispatch<React.SetStateAction<number | undefined>>,
    setIsMobileChatActive: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    setCurrentUser({
      username: name,
      image: imageUrl,
      id,
      providerId: parseInt(providerId),
    });
    setIsMobileChatActive(true);
    try {
      let res = await axios.post("/api/accessChat", { userId: id });
      setChatRoom(res.data.id);
      this.setFetching(true);
      res = await axios.post("/api/getAllMessages", { chatId: res.data.id });
      console.log(res.data);
      this.setMessages(
        res.data.map((msg: any) => ({
          user: msg.sender.name,
          message: msg.content,
          sentByUser: msg.senderId === this.newId,
          Date: msg.createdAt,
        })),
      );
      this.setFetching(false);
    } catch (error) {
      console.error("Error accessing chat:", error);
      this.setFetching(false);
    }
  }

  async sendMessage(
    inputMessage: string,
    chatRoom: number | undefined,
    setInputMessage: React.Dispatch<React.SetStateAction<string>>,
  ) {
    if (inputMessage.trim() !== "" && chatRoom !== undefined) {
      const newMessage: MESSAGE = {
        user: this.sessionUser,
        message: inputMessage,
        sentByUser: true,
        Date: new Date().toLocaleDateString(),
      };
      this.setMessages((prevMessages) => [...prevMessages, newMessage]);

      WebSocketManager.getInstance().sendMessage({
        type: "PUBLISH",
        chatId: chatRoom,
        message: inputMessage,
      });

      try {
        await axios.post("/api/sendMessage", {
          content: inputMessage,
          chatId: chatRoom,
        });
        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }
}
