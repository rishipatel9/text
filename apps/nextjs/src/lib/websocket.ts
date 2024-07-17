import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  sender: string;
  message: string;
}

const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      console.log('Received message:', event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.current?.close();
    }; 
  }, [url]);

  const sendMessage = useCallback(
    (message: object) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message));
      }
    },
    []
  );

  return { messages, sendMessage };
};

export default useWebSocket;
