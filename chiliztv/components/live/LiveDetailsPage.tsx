"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import Image from "next/image";
import PredictionsDialog from "../predictions/PredictionsDialog";
import { getFanToken } from "@/utils/FanTokens";
import ChatBox from "./Chats";

interface LiveDetailsPageProps {
    readonly id: string;
}

export default function LiveDetailsPage({ id }: LiveDetailsPageProps) {
    const { primaryWallet, user, setShowAuthFlow } = useDynamicContext();

    const walletAddress = primaryWallet?.address ?? "";

    const [TeamA, setTeamA] = useState("");
    const [TeamB, setTeamB] = useState("");
    const [matchInProgress] = useState(false);

    const handlePrediction= (team: string, amount: string) => {
        console.log("Prediction placed:", { team, amount });
    };

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

    useEffect(() => {
        setTeamA("PSG");
        setTeamB("INTER");
    }, []);

    if (!id) return null;

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
                <span className="bg-yellow-400 text-black rounded-full px-3 py-1 shadow-lg">0</span>
                </div>
                <span className="text-yellow-400 font-bold">-</span>
                <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-black rounded-full px-3 py-1 shadow-lg">0</span>
                <span>{TeamB}</span>
                <Image src={getFanToken(TeamB)?.image ?? "/placeholder.png"} alt={TeamB} width={40} height={40} className="rounded-full object-cover" />
                </div>
            </div>
            {!matchInProgress ? (
                <>
                <div className="text-xl font-bold mb-3 text-white drop-shadow-lg">Place Prediction</div>
                <PredictionsDialog
                    isLoggedIn={!!primaryWallet?.address}
                    onLogin={() => setShowAuthFlow(true)}
                    onpredictionPlaced={handlePrediction}
                    TeamA={TeamA}
                    TeamB={TeamB}
                    matchId={id}
                    userId={user?.userId ?? ""}
                    username={String(user?.username ?? "")}
                    walletAddress={walletAddress}
                />
                </>
            ) : (
                <div className="text-center text-yellow-400 font-semibold py-6 select-none">
                Predictions are closed while the match is in progress.
                </div>
            )}
            </div>

            <div className="p-4 border-t border-white/10 flex-shrink-0">
            <Image src="/ads/compensation_fund.png" alt="Promo" width={400} height={80} className="rounded-lg w-full" />
            </div>

            {/* Chat */}
            <ChatBox matchId={id} userId={user?.userId ?? ""} username={String(user?.username ?? "")} walletAddress={walletAddress} />
        </div>
        </div>
    );
}
