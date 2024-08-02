import { useEffect, useRef } from "react";

export function useScrollToBottom(messages: any[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return messagesEndRef;
}
