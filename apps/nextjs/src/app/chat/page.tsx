'use client';
import { useState, useEffect } from 'react';
import useWebSocket from '../../lib/websocket';

const Chat = () => {
  const { messages, sendMessage } = useWebSocket('ws://localhost:4000');
  const [input, setInput] = useState<string>('');
  const [channel, setChannel] = useState<string>('');
  const [username,setUsername] = useState<string>('');

  useEffect(() => {
    // Example of subscribing to a default channel when component mounts
    // setChannel('');
    sendMessage({ type: 'subscribe', channel: 'default' });

    return () => {
      sendMessage({ type: 'unsubscribe', channel: 'default' });
    };
  }, [sendMessage]);

  const handleSendMessage = () => {
    if (channel && input) {
      sendMessage({ type: 'sendMessage', channel, message: input });
      setInput('');
    }
  };

  const handleSubscribe = () => {
    if (channel) {
      sendMessage({ type: 'subscribe', channel });
    }
  };

  const handleUnsubscribe = () => {
    if (channel) {
      sendMessage({ type: 'unsubscribe', channel });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat App</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Channel"
          value={username}
          onChange={(event)=>setUsername(event.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleSubscribe}
          className="bg-yellow-500 text-white px-3 py-2 rounded mr-2"
        >
          set username
        </button>
        </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleSubscribe}
          className="bg-blue-500 text-white px-3 py-2 rounded mr-2"
        >
          Subscribe
        </button>
        <button
          onClick={handleUnsubscribe}
          className="bg-red-500 text-white px-3 py-2 rounded"
        >
          Unsubscribe
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 text-white px-3 py-2 rounded"
        >
          Send
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Messages</h2>
        <ul className="list-disc pl-5">
          {messages.map((message, index) => (
            <li key={index} className="mb-1">{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
