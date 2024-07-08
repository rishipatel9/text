'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Page = () => {
    const [message, setMessage] = useState("");
    const [recipientId, setRecipientId] = useState("");
    const [userId, setUserId] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [chats, setChats] = useState<string[]>([]);

    useEffect(() => {
        // Establish WebSocket connection when component mounts
        const newSocket = new WebSocket('ws://localhost:8080');
        

        // WebSocket event listeners
        newSocket.onopen = () => {
            console.log('Connection established');
        };
        
        newSocket.onmessage = (event) => {
            try {
                const messageData = JSON.parse(event.data);
                if (messageData.type === 'user-id') {
                    setUserId(messageData.userId); // Save user ID for reference
                } else {
                    console.log('Message received:', messageData);
                    setChats((prevChats) => [...prevChats, messageData]);
                }
            } catch (error) {
                console.error('Failed to parse message', error);
            }
        };

        // Set the socket state and close the connection when the component unmounts
        setSocket(newSocket);
        return () => {
            
            newSocket.close();
            console.log('Connection closed');
        };
    }, []);

    const handleSend = () => {
        if (socket && message.trim() !== "" && recipientId.trim() !== "") {
            const messageObject = {
                recipient: recipientId,
                content: message
            };
            socket.send(JSON.stringify(messageObject));
            setMessage('');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
                <p>Your ID: {userId}</p>
                <input
                    type="text"
                    placeholder="Recipient ID"
                    className="bg-slate-100 rounded-md shadow-sm h-10 m-5 p-1"
                    value={recipientId}
                    onChange={(event) => setRecipientId(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Message"
                    className="bg-slate-100 rounded-md shadow-sm h-10 m-5 p-1"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />
                <Button onClick={handleSend}>Send</Button>
            </div>
            <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
                <h1>Chats</h1>
                <ul>
                    {chats.map((chat, index) => (
                        <li key={index}>{chat.content}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Page;
