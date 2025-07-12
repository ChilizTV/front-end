"use client";

import { Button } from "@/components/ui/button";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import BetDialog from "../bets/BetsDialog";

interface LiveDetailsPageProps {
    readonly id: string;
}

interface ChatMessage {
    id: number;
    user: string;
    text: string;
    featured: boolean;
    timestamp?: string;
}

const usernameColors: Record<string, string> = {
  You: "#22c55e", // green
  user123: "#3b82f6", // blue
  pgc_token: "#f59e0b", // amber
  giga_trader: "#ef4444", // red
};

export default function LiveDetailsPage({ id }: LiveDetailsPageProps) {
    const { login } = useLogin();
    const { authenticated } = usePrivy();

    const [message, setMessage] = useState("");
    const [TeamA, setTeamA] = useState("PSG");
    const [TeamB, setTeamB] = useState("JUV");

    const [commentators] = useState([
        { id: 1, name: "John Doe", image: "/commentators/john_doe.jpg", language: "English" },
        { id: 2, name: "Jane Smith", image: "/commentators/jane_smith.jpg", language: "Spanish" },
        { id: 3, name: "Alex Rivera", image: "/commentators/alex_rivera.jpg", language: "French" },
    ]);

    const [selectedCommentatorId, setSelectedCommentatorId] = useState(1);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 1, user: "user123", text: "Let's gooo 🚀", featured: false, timestamp: "10:00 AM" },
        { id: 2, user: "pgc_token", text: "Pump incoming", featured: false, timestamp: "10:01 AM" },
        { id: 3, user: "giga_trader", text: "Betting on PSG to win!", featured: true, timestamp: "10:02 AM" },
    ]);
    const [highlightId, setHighlightId] = useState<number | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [isFeaturedNext, setIsFeaturedNext] = useState(false);

    useEffect(() => {
        async function fetchTeams() {
        setTeamA("PSG");
        setTeamB("JUV");
        }
        fetchTeams();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    if (!id) {
        return 1;
    }

    const getCurrentTimestamp = () => {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const handleBetting = (team: string, amount: string) => {
        console.log(`Bet placed: ${amount} on ${team}`);
        setMessage(`Bet of $${amount} placed on ${team}`);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMsg: ChatMessage = {
        id: Date.now(),
        user: "You",
        text: message.trim(),
        featured: isFeaturedNext,
        timestamp: getCurrentTimestamp(),
        };

        setChatMessages((prev) => [...prev, newMsg]);
        setMessage("");
        setHighlightId(newMsg.id);
        setIsFeaturedNext(false);

        setTimeout(() => setHighlightId(null), 2000);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
        {/* Left: Video + Commentators */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Video Stream */}
            <div className="aspect-video w-full bg-zinc-900 relative rounded-xl shadow-lg">
            <iframe
                src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID"
                title="Live Stream"
                className="absolute inset-0 w-full h-full rounded-xl"
                allowFullScreen
            />
            </div>

            {/* Commentators Section */}
            <div className="p-6 border-t border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl shadow-lg mt-6 mx-4">
            <div className="text-base font-semibold mb-6 select-none text-yellow-400">
                🎙️ Select Your Commentator
            </div>
            <div className="flex gap-8 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-zinc-900">
            {commentators.map((commentator) => {
            const isSelected = selectedCommentatorId === commentator.id;
            return (
                <button
                key={commentator.id}
                onClick={() => setSelectedCommentatorId(commentator.id)}
                className={`relative group rounded-2xl p-2 transition-all duration-300
                    bg-zinc-800/60 hover:bg-yellow-500/20
                    flex flex-col items-center
                    shadow-md
                    ${
                        isSelected
                        ? "ring-4 ring-primary ring-offset-4 ring-offset-zinc-950 shadow-yellow-400"
                        : "ring-0"
                    }
                `}
                title={commentator.name}
                aria-pressed={isSelected}
                >
                <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Image
                    src={commentator.image}
                    alt={commentator.name}
                    fill
                    className="object-cover"
                    priority={isSelected}
                    />
                    <span className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 border-2 border-zinc-950 rounded-full animate-pulse" />
                </div>
                <div className="mt-3 text-white text-sm font-semibold truncate w-24 text-center select-none">
                    {commentator.name}
                </div>
                <div className="mt-1 text-yellow-400 text-xs select-none truncate w-24 text-center">
                    {commentator.language}
                </div>
                </button>
            );
            })}

            </div>
            </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[400px] border-l border-white/10 bg-zinc-950 flex flex-col h-screen md:h-auto">
            {/* Place Bet Panel */}
            <div
            className="
                p-6 
                border-b border-white/20 
                bg-gradient-to-tr from-primary/80 to-primary/50 
                shadow-lg 
                rounded-b-xl
                sticky top-0 md:static
                z-20
                flex-shrink-0
            "
            style={{ backdropFilter: "blur(10px)" }}
            >
            <div className="text-xl font-bold mb-3 text-white drop-shadow-lg">Place Bet</div>
            <BetDialog
                isLoggedIn={authenticated}
                onLogin={login}
                onBetPlaced={(team, amount) => {
                handleBetting(team, amount);
                }}
                TeamA={TeamA}
                TeamB={TeamB}
            />
            </div>

            {/* Ad/Promo */}
            <div className="p-4 border-t border-white/10 flex-shrink-0">
            <Image
                src="/ads/compensation_fund.png"
                alt="Promo"
                width={400}
                height={80}
                className="rounded-lg w-full"
            />
            </div>

            {/* Chat */}
            <div className="flex flex-col border-t border-white/10 p-4 flex-1 min-h-0">
            <div className="font-bold mb-3 text-lg select-none">Live Chat</div>

            {/* Chat Messages Container */}
            <div className="relative flex-1 overflow-hidden rounded-lg min-h-0">
                <div
                className="overflow-y-auto px-2 py-1 flex flex-col gap-2 h-full scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-zinc-900"
                style={{ scrollBehavior: "smooth" }}
                >
                {chatMessages.map((msg) => {
                    const isOwn = msg.user === "You";
                    const usernameColor = usernameColors[msg.user] ?? "#ddd";
                    return (
                    <div
                        key={msg.id}
                        className={`max-w-[85%] px-4 py-2 rounded-xl break-words relative
                        ${
                            msg.featured
                            ? isOwn
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold shadow-lg shadow-yellow-400/70"
                                : "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold shadow-md shadow-yellow-500/70"
                            : isOwn
                            ? "bg-primary/80 text-white font-semibold"
                            : "bg-white/10 text-white/80"
                        }
                        ${highlightId === msg.id ? "ring-2 ring-yellow-400 animate-pulse" : ""}
                        ${isOwn ? "self-end" : "self-start"}
                        `}
                        style={{ animationDuration: "0.3s" }}
                    >
                        <div className="flex items-center gap-2 mb-1 select-none">
                        <span
                            className="font-semibold"
                            style={{ color: usernameColor }}
                        >
                            {msg.user}
                        </span>
                        <span className="text-xs text-white/60">{msg.timestamp}</span>
                        {msg.featured && (
                            <span className="text-yellow-400 text-sm select-none" title="Featured message">
                            ⭐
                            </span>
                        )}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    );
                })}
                <div ref={chatEndRef} />
                </div>

                {/* Fades */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-950 to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-950 to-transparent" />
            </div>

            {/* Input + Buttons */}
            <div className="flex gap-2 items-center mt-4 flex-shrink-0">
                <Textarea
                rows={1}
                placeholder={authenticated ? "Type your message..." : "Log in to chat"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-zinc-800 text-white flex-1 resize-none rounded-lg px-3 py-2 placeholder:text-zinc-400 focus:ring-2 focus:ring-yellow-400 transition"
                disabled={!authenticated}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                    }
                }}
                autoFocus={authenticated}
                style={{ maxHeight: 120, overflowY: "auto" }}
                />
                {/* Featured toggle button */}
                <button
                type="button"
                onClick={() => setIsFeaturedNext((prev) => !prev)}
                aria-label="Toggle featured message"
                title="Mark message as featured"
                className={`p-2 rounded-md transition-colors duration-200 flex items-center justify-center text-lg
                    ${
                    isFeaturedNext
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/50"
                        : "bg-zinc-700 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    }
                `}
                disabled={!authenticated}
                >
                ⭐
                </button>
                <Button
                className="whitespace-nowrap"
                onClick={handleSendMessage}
                disabled={!message.trim() || !authenticated}
                >
                Send
                </Button>
            </div>
            </div>
        </div>
        </div>
    );
}