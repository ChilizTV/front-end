/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useEffect, useState, useRef } from "react";
import { Star, Send } from "lucide-react";
import { ChatService } from "@/services/chat.service";
import { ChatMessage } from "@/models/chat.model";

interface ChatBoxProps {
    matchId: string;
    userId: string;
    username: string;
    walletAddress: string;
}

export default function ChatBox({ matchId, userId, username, walletAddress }: ChatBoxProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                console.log("📥 Fetching messages for match:", matchId);
                const result = await ChatService.getRoomMessages(parseInt(matchId));
                console.log("📥 Messages fetch result:", result);
                
                if (result.errorCode === 0 && result.result) {
                    const extendedMessages: ChatMessage[] = result.result.map(msg => ({
                        ...msg,
                        walletAddress: (msg as any).walletAddress || "",
                        isFeatured: (msg as any).isFeatured || false
                    }));
                    
                    console.log("📋 Processed messages:", extendedMessages.map(msg => ({
                        username: msg.username,
                        message: msg.message.substring(0, 30) + "...",
                        isFeatured: msg.isFeatured
                    })));
                    
                    setMessages(extendedMessages);
                }
            } catch (err) {
                console.error("❌ Error fetching messages:", err);
            }
        };

        fetchMessages();
        
        const interval = setInterval(fetchMessages, 2000);

        return () => clearInterval(interval);
    }, [matchId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        console.log("🚀 Sending message:", {
            matchId,
            userId,
            username,
            message: newMessage,
            walletAddress
        });

        try {
            const result = await ChatService.sendMessage(
                parseInt(matchId),
                userId,
                username,
                newMessage,
                walletAddress
            );

            console.log("📡 Backend response:", result);

            if (result.errorCode === 0 && result.result) {
                // Use the server response to determine if message is featured
                const serverMessage = result.result as ChatMessage;
                console.log("✅ Server message data:", serverMessage);
                
                const extendedMessage: ChatMessage = {
                    ...serverMessage,
                    walletAddress: (serverMessage as any).walletAddress || walletAddress,
                    isFeatured: (serverMessage as any).isFeatured || false
                };
                
                console.log("🎯 Extended message with featured status:", {
                    message: extendedMessage.message,
                    isFeatured: extendedMessage.isFeatured,
                    username: extendedMessage.username
                });
                
                setMessages((prev) => [...prev, extendedMessage]);
                setNewMessage("");
                console.log("✅ Message added to chat successfully");
            } else {
                console.error("❌ Failed to send message:", result);
                alert("Failed to send message");
            }
        } catch (err) {
            console.error("❌ Error sending message:", err);
            alert("Error sending message");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const isOwnMessage = (msg: ChatMessage) => {
        return msg.userId === userId || msg.username === username;
    };

    return (
        <div className="bg-gray-900 text-white w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">Live Chat</h2>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => {
                    const ownMessage = isOwnMessage(msg);
                    return (
                        <div key={msg.id || idx} className={`flex ${ownMessage ? 'justify-end' : 'justify-start'}`}>
                            <div className={`space-y-1 max-w-xs ${ownMessage ? 'text-right' : 'text-left'}`}>
                                <div className={`flex items-center gap-2 ${ownMessage ? 'justify-end' : 'justify-start'}`}>
                                    {!ownMessage && (
                                        <span className="text-blue-400 font-medium text-sm">
                                            {msg.username}
                                        </span>
                                    )}
                                    <span className="text-gray-500 text-xs">
                                        {formatTime(msg.timestamp)}
                                    </span>
                                    {msg.isFeatured && (
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    )}
                                    {ownMessage && (
                                        <span className="text-blue-400 font-medium text-sm">
                                            {msg.username}
                                        </span>
                                    )}
                                </div>
                                <div className={`rounded-lg p-3 ${
                                    msg.isFeatured
                                        ? "bg-yellow-500 text-black font-medium"
                                        : ownMessage
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-100"
                                }`}>
                                    {msg.message}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none placeholder-gray-400"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                        />
                    </div>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        onClick={handleSendMessage}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
