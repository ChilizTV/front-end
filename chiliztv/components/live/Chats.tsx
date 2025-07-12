import { useEffect, useState, useRef } from "react";
import { Star, Send } from "lucide-react";

interface ChatMessage {
    userId: string;
    username: string;
    message: string;
    timestamp: string;
    isFeatured?: boolean;
    walletAddress: string;
}

interface ChatBoxProps {
    matchId: string;
    userId: string;
    username: string;
    walletAddress: string;
}

export default function ChatBox({ matchId, userId, username, walletAddress }: ChatBoxProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            userId: "123",
            username: "user123",
            message: "Let's gooo 🚀",
            timestamp: "10:00 AM",
            isFeatured: false,
            walletAddress: ""
        },
        {
            userId: "456",
            username: "pgc_token",
            message: "Pump incoming",
            timestamp: "10:01 AM",
            isFeatured: false,
            walletAddress: ""
        },
        {
            userId: "789",
            username: "giga_trader",
            message: "Betting on PSG to win!",
            timestamp: "10:02 AM",
            isFeatured: true,
            walletAddress: ""
        }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [isNextFeatured, setIsNextFeatured] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const baseUrl = "https://back-end-kps2.onrender.com/chat";

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

        const messagePayload = {
            userId,
            username,
            message: newMessage,
            walletAddress,
            isFeatured: isNextFeatured,
        };

        try {
            const res = await fetch(`${baseUrl}/message/${matchId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messagePayload),
            });

            const data = await res.json();
            if (data.success) {
                setMessages((prev) => [...prev, data.data]);
                setNewMessage("");
                setIsNextFeatured(false);
            } else {
                alert("Failed to send message");
            }
        } catch (err) {
            console.error("Error sending message:", err);
            // Local fallback
            const newMsg = {
                ...messagePayload,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, newMsg]);
            setNewMessage("");
            setIsNextFeatured(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="bg-gray-900 text-white w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold">Live Chat</h2>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-400 font-medium text-sm">
                                {msg.username}
                            </span>
                            <span className="text-gray-500 text-xs">
                                {msg.timestamp}
                            </span>
                            {msg.isFeatured && (
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            )}
                        </div>
                        <div className={`rounded-lg p-3 max-w-xs ${
                            msg.isFeatured
                                ? "bg-yellow-500 text-black font-medium"
                                : "bg-gray-700 text-gray-100"
                        }`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
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
                            placeholder={isNextFeatured ? "Type your featured message..." : "Type your message..."}
                        />
                    </div>
                    <button
                        className={`px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2
                            ${isNextFeatured ? "bg-yellow-600 text-black" : "bg-yellow-500 hover:bg-yellow-600 text-black"}`}
                        onClick={() => setIsNextFeatured((prev) => !prev)}
                        title={isNextFeatured ? "Unmark as Featured" : "Mark as Featured"}
                    >
                        <Star className="w-4 h-4" />
                    </button>
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
