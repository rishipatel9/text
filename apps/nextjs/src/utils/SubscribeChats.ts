import WebSocketManager from "@/lib/WebSocketManager";
import axios from "axios";
import { useEffect } from "react";
import { useSessionData } from "../hooks/useSessionData";

export const useSubscribeChats = () => {
  const { session } = useSessionData();
  useEffect(() => {
    const subscribeChats = async () => {
      try {
        const res = await axios.get("api/getSubscription");
        const newLocal = "SUBSCRIBE";
        WebSocketManager.getInstance().sendMessage({
          type: newLocal,
          chatIds: res.data,
        });
      } catch (e) {
        console.log(e);
      }
    };
    subscribeChats();
  }, [session]);
};
