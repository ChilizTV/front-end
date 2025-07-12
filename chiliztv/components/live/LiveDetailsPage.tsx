"use client";

import { Button } from "@/components/ui/button";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import BetDialog from "../bets/BetsDialog";
import { getFanToken } from "@/utils/FanTokens";

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
    You: "#22c55e",
    user123: "#3b82f6",
    pgc_token: "#f59e0b",
    giga_trader: "#ef4444",
};

export default function LiveDetailsPage({ id }: LiveDetailsPageProps) {
    const { login } = useLogin();
    const { authenticated, user } = usePrivy();

    const [message, setMessage] = useState("");
    const [TeamA, setTeamA] = useState("");
    const [TeamB, setTeamB] = useState("");
    const [matchInProgress] = useState(false);

    const [commentators] = useState([
        {
        id: 1,
        name: "L' immigré parisien",
        image: "https://yt3.googleusercontent.com/TImr7vOE9Rd6LPjbIzuGbw0NvCbjjGb16FuUIR40ytpIWynoDPXM7lBnQVtheQp2N6PtBwlwo9A=s120-c-k-c0x00ffffff-no-rj",
        language: "French",
        videoUrl: "https://www.youtube.com/embed/Nh7QwaQm4ig",
        },
        {
        id: 2,
        name: "Live Football Streams",
        image: "https://yt3.ggpht.com/vcNMjU0ol9ol6oj8nyVZYp4SaLwvAtM35LMfSvKPV2-Q7CuBNFdXA26Fs4Qg7erYLYp3aVLJVg=s48-c-k-c0x00ffffff-no-rj",
        language: "English",
        videoUrl: "https://www.youtube.com/embed/vZap2RztPF8",
        },
    ]);

    const [selectedCommentatorId, setSelectedCommentatorId] = useState(1);
    const selectedCommentator = commentators.find((c) => c.id === selectedCommentatorId)!;

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: 1, user: "user123", text: "Let's gooo 🚀", featured: false, timestamp: "10:00 AM" },
        { id: 2, user: "pgc_token", text: "Pump incoming", featured: false, timestamp: "10:01 AM" },
        { id: 3, user: "giga_trader", text: "Betting on PSG to win!", featured: true, timestamp: "10:02 AM" },
    ]);

    const [highlightId, setHighlightId] = useState<number | null>(null);
    const [isFeaturedNext, setIsFeaturedNext] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTeamA("PSG");
        setTeamB("INTER");
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    if (!id) return null;

    const getCurrentTimestamp = () =>
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleBetting = (team: string, amount: string) => {
        setMessage(`Bet of $${amount} placed on ${team}`);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMsg: ChatMessage = {
        id: Date.now(),
        user: authenticated ? String(user?.customMetadata?.username ?? "You") : "Guest",
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
        {/* Left side */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Video */}
            <div className="aspect-video w-full bg-zinc-900 relative rounded-xl shadow-lg">
            <iframe
                width="100%"
                height="100%"
                src={selectedCommentator.videoUrl}
                title={selectedCommentator.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
            </div>

            {/* Commentator selector */}
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
                    className={`relative group rounded-2xl p-2 transition-all duration-300 bg-zinc-800/60 hover:bg-yellow-500/20 flex flex-col items-center shadow-md ${
                        isSelected ? "ring-4 ring-primary ring-offset-4 ring-offset-zinc-950 shadow-yellow-400" : "ring-0"
                    }`}
                    title={commentator.name}
                    aria-pressed={isSelected}
                    >
                    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Image src={commentator.image} alt={commentator.name} fill className="object-cover" />
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

        {/* Right sidebar */}
        <div className="w-full md:w-[400px] border-l border-white/10 bg-zinc-950 flex flex-col h-screen md:h-auto">
            <div className="p-6 border-b border-white/20 bg-gradient-to-tr from-primary/80 to-primary/50 shadow-lg rounded-b-xl sticky top-0 md:static z-20 flex-shrink-0">
            <div className="flex justify-center items-center gap-6 mb-4 text-white font-semibold text-2xl select-none">
                <div className="flex items-center gap-2">
                <Image src={getFanToken(TeamA)?.image ?? "/placeholder.png"} alt={TeamA} width={40} height={40} className="rounded-full object-cover" />
                <span>{TeamA}</span>
                <span className="bg-yellow-400 text-black rounded-full px-3 py-1 shadow-lg">2</span>
                </div>
                <span className="text-yellow-400 font-bold">-</span>
                <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-black rounded-full px-3 py-1 shadow-lg">1</span>
                <span>{TeamB}</span>
                <Image src={getFanToken(TeamB)?.image ?? "/placeholder.png"} alt={TeamB} width={40} height={40} className="rounded-full object-cover" />
                </div>
            </div>
            {!matchInProgress ? (
                <>
                <div className="text-xl font-bold mb-3 text-white drop-shadow-lg">Place Bet</div>
                <BetDialog
                    isLoggedIn={authenticated}
                    onLogin={login}
                    onBetPlaced={handleBetting}
                    TeamA={TeamA}
                    TeamB={TeamB}
                />
                </>
            ) : (
                <div className="text-center text-yellow-400 font-semibold py-6 select-none">
                Betting is closed while the match is in progress.
                </div>
            )}
            </div>

            <div className="p-4 border-t border-white/10 flex-shrink-0">
            <Image src="/ads/compensation_fund.png" alt="Promo" width={400} height={80} className="rounded-lg w-full" />
            </div>

            {/* Chat */}
            <div className="flex flex-col border-t border-white/10 p-4 flex-1 min-h-0">
            <div className="font-bold mb-3 text-lg select-none">Live Chat</div>
            <div className="relative flex-1 overflow-hidden rounded-lg min-h-0">
                <div className="overflow-y-auto px-2 py-1 flex flex-col gap-2 h-full scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-zinc-900">
                {chatMessages.map((msg) => {
                    const isOwn = msg.user === "You";
                    const usernameColor = usernameColors[msg.user] ?? "#ddd";
                    return (
                    <div
                        key={msg.id}
                        className={`max-w-[85%] px-4 py-2 rounded-xl break-words relative ${
                        msg.featured
                            ? isOwn
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold shadow-lg shadow-yellow-400/70"
                            : "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold shadow-md shadow-yellow-500/70"
                            : isOwn
                            ? "bg-primary/80 text-white font-semibold"
                            : "bg-white/10 text-white/80"
                        } ${highlightId === msg.id ? "ring-2 ring-yellow-400 animate-pulse" : ""} ${
                        isOwn ? "self-end" : "self-start"
                        }`}
                    >
                        <div className="flex items-center gap-2 mb-1 select-none">
                        <span className="font-semibold" style={{ color: usernameColor }}>
                            {msg.user}
                        </span>
                        <span className="text-xs text-white/60">{msg.timestamp}</span>
                        {msg.featured && <span className="text-yellow-400 text-sm select-none" title="Featured message">⭐</span>}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    );
                })}
                <div ref={chatEndRef} />
                </div>
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-950 to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-950 to-transparent" />
            </div>

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
                <button
                type="button"
                onClick={() => setIsFeaturedNext((prev) => !prev)}
                aria-label="Toggle featured message"
                title="Mark message as featured"
                className={`p-2 rounded-md transition-colors duration-200 flex items-center justify-center text-lg ${
                    isFeaturedNext
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/50"
                    : "bg-zinc-700 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                }`}
                disabled={!authenticated}
                >
                ⭐
                </button>
                <Button onClick={handleSendMessage} disabled={!message.trim() || !authenticated}>
                Send
                </Button>
            </div>
            </div>
        </div>
        </div>
    );
}
