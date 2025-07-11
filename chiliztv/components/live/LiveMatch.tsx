"use client";

import { Button } from "@/components/ui/button";
import { useLogin, useLogout, useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface LiveDetailsPageProps {
    readonly id: string;
}

export default function LiveDetailsPage({ id }: LiveDetailsPageProps) {
    const { login } = useLogin();
    const { logout } = useLogout();
    const { wallets } = useWallets();

    const [message, setMessage] = useState("");

    if (!id) {
        return 1;
    }

    const isLoggedIn = wallets.length > 0;
    const walletAddress = isLoggedIn ? wallets[0]?.address : null;
    const displayAddress = walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : "";

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
        {/* Left: Video + Chart */}
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Video Stream */}
            <div className="aspect-video w-full bg-zinc-900 relative">
            <iframe
                src="https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID"
                title="Live Stream"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
            />
            </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[400px] border-l border-white/10 bg-zinc-950 flex flex-col">
            {/* Wallet Info */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
            {isLoggedIn ? (
                <>
                <span className="text-sm text-white/80">{displayAddress}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                    Disconnect
                </Button>
                </>
            ) : (
                <Button variant="outline" size="sm" onClick={login}>
                Connect Wallet
                </Button>
            )}
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col border-b border-white/10">
            <div className="p-4 font-bold">Live Chat</div>
            <div className="flex-1 overflow-y-auto px-4 space-y-2 text-sm">
                {/* Example messages */}
                <div className="text-white/70">user123: Let’s gooo 🚀</div>
                <div className="text-white/70">pgc_token: Pump incoming</div>
                <div className="text-white/70">giga_trader: Bought 5 SOL</div>
            </div>
            {/* Message input */}
            <div className="p-4 border-t border-white/10">
                <Textarea
                rows={2}
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-zinc-800 text-white"
                />
                <Button className="mt-2 w-full" disabled={!message.trim()}>
                Send
                </Button>
            </div>
            </div>

            {/* Betting Panel */}
            <div className="p-4">
            <div className="text-lg font-semibold mb-2">Place Bet</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
                <Button variant="secondary">Buy</Button>
                <Button variant="outline">Sell</Button>
            </div>
            <Input placeholder="Amount in SOL" className="mb-2 bg-zinc-800 text-white" />
            <Button className="w-full">Log in to Trade</Button>
            </div>

            {/* Ad/Promo */}
            <div className="p-4 border-t border-white/10">
            <Image
                src="/ads/compensation_fund.png"
                alt="Promo"
                width={400}
                height={80}
                className="rounded-lg w-full"
            />
            </div>
        </div>
        </div>
    );
}
