"use client";
import { Sidebar, SidebarBody, SidebarProvider } from "@/components/ui/sidebar";
import React, { useState, ChangeEvent } from "react";
import useWebSocket from "../../lib/websocket";

const Chat = () => {
  const { messages, sendMessage } = useWebSocket("ws://localhost:4000");
  const [input, setInput] = useState<string>("");
  const [channel, setChannel] = useState<string>("");

  const handleSendMessage = () => {
    if (channel && input) {
      sendMessage({ type: "PUBLISH", channel, message: input });
      setInput("");
    } else {
      alert(
        "Please set a username, select a channel, and type a message before sending.",
      );
    }
  };

  const handleSubscribe = () => {
    if (channel) {
      sendMessage({ type: "SUBSCRIBE", channel });
    }
  };

  const handleUnsubscribe = () => {
    if (channel) {
      sendMessage({ type: "UNSUBSCRIBE", channel });
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarBody>
          <div className="container w-[5vw] h-[100vh] mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chat App</h1>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Channel"
                value={channel}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setChannel(e.target.value)
                }
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
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
                {messages.map((message, index) => {
                  // const { sender, message: msg } = message;
                  return (
                    <li key={index} className="mb-1">
                      <strong>{message}:</strong>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </SidebarProvider>
  );
};

export default Chat;
