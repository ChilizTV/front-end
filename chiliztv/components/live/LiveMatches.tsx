"use client";
import { useRouter } from "next/navigation";

import { Clock, CircleDot } from "lucide-react";
import Image from "next/image";

export default function LiveMatches() {
    const router = useRouter();

    const matches = [
        {
        id: 1,
        teamA: "Barcelona",
        teamB: "Real Madrid",
        score: "2 - 1",
        time: "78'",
        logoA: "/barca.png",
        logoB: "/madrid.png",
        },
        {
        id: 2,
        teamA: "Manchester City",
        teamB: "Liverpool",
        score: "1 - 1",
        time: "56'",
        logoA: "/city.png",
        logoB: "/liverpool.png",
        },
        {
        id: 3,
        teamA: "Juventus",
        teamB: "AC Milan",
        score: "0 - 0",
        time: "34'",
        logoA: "/juve.png",
        logoB: "/milan.png",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white px-6 md:px-12 py-24" style={{ fontFamily: "Lexend, sans-serif" }}>
        <h1 className="text-[36px] font-bold mb-10 text-center text-white">Live Matches</h1>

        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full cursor-pointer"
        onClick={
            () => [
                router.push(`/live/{match.id}`) // Assuming you have a dynamic route for each match,
            ]
        }
        >
            {/* Match Cards */}
            {matches.map((match) => (
            <div
                key={match.id}
                className="bg-gradient-to-r from-[#1a1919]/95 to-[#000000]/90 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md w-full"
            >
                <div className="flex items-center justify-between">
                {/* Teams */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                    <Image src={match.logoA} alt={match.teamA} width={36} height={36} className="rounded-full" />
                    <span className="font-semibold">{match.teamA}</span>
                    </div>
                    <span className="text-xl font-bold">{match.score}</span>
                    <div className="flex items-center gap-2">
                    <Image src={match.logoB} alt={match.teamB} width={36} height={36} className="rounded-full" />
                    <span className="font-semibold">{match.teamB}</span>
                    </div>
                </div>

                {/* Match Info */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>{match.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-500 text-sm font-bold animate-pulse">
                    <CircleDot className="w-4 h-4" />
                    <span>LIVE</span>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}
