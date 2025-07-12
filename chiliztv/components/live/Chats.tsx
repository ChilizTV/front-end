// components/chat/ChatBox.tsx
"use client";

import { useEffect, useState } from "react";

interface ChatMessage {
    userId: string;
    username: string;
    message: string;
    timestamp: string;
}

    interface ChatBoxProps {
    matchId: string;
    userId: string;
    username: string;
}

export default function ChatBox({ matchId, userId, username }: ChatBoxProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const baseUrl = "https://back-end-kps2.onrender.com/chat";

    // Fetch existing messages
    useEffect(() => {
        const fetchMessages = async () => {
        try {
            const res = await fetch(`${baseUrl}/messages/${matchId}`);
            const data = await res.json();
            if (data.success) {
            setMessages(data.messages);
            }
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
        };

        fetchMessages();
    }, [matchId]);

    // Send message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
        const res = await fetch(`${baseUrl}/message/${matchId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, username, message: newMessage }),
        });

        const data = await res.json();
        if (data.success) {
            setMessages((prev) => [...prev, data.data]);
            setNewMessage("");
        } else {
            alert("Failed to send message");
        }
        } catch (err) {
        console.error("Error sending message:", err);
        }
    };

    return (
        <div className="border rounded-2xl shadow p-4 max-w-xl mx-auto my-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Live Chat</h2>
        <div className="h-64 overflow-y-auto mb-4 border p-2 rounded">
            {messages.map((msg, idx) => (
            <div key={idx} className="mb-2">
                <strong>{msg.username}:</strong> {msg.message}
                <div className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
            ))}
        </div>
        <div className="flex gap-2">
            <input
            className="flex-1 border px-2 py-1 rounded"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            />
            <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            onClick={handleSendMessage}
            >
            Send
            </button>
        </div>
        </div>
    );
}
