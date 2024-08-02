import { useState, useEffect } from "react";
import axios from "axios";
import { MESSAGE } from "@/lib/types";

export function useChatMessages(
  currentUser: any,
  chatRoom: number | undefined,
) {
  const [messages, setMessages] = useState<Array<MESSAGE>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && chatRoom) {
      const fetchMessages = async () => {
        try {
          const res = await axios.post("/api/getAllMessages", {
            chatId: chatRoom,
          });
          setMessages(
            res.data.map((msg: any) => ({
              user: msg.sender.name,
              message: msg.content,
              sentByUser: msg.senderId === currentUser?.id,
              Date: msg.createdAt,
            })),
          );
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    }
  }, [currentUser, chatRoom]);

  const sendMessage = async (message: string) => {
    if (message.trim() === "") return;
    setLoading(true);
    try {
      await axios.post("/api/sendMessage", {
        content: message,
        chatId: chatRoom,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: currentUser.username,
          message,
          sentByUser: true,
          Date: new Date().toLocaleDateString(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, setMessages, sendMessage, loading };
}
