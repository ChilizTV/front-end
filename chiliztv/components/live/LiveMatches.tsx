"use client";
import { useRouter } from "next/navigation";
import { Clock, Trophy, TrendingUp, Zap, Eye } from "lucide-react";
import Image from "next/image";
import { getFanToken } from "@/utils/FanTokens";

type MatchStatus = "LIVE" | "BET_OPEN" | "ENDED";

interface Match {
    id: string | number;
    teamA: string;
    teamB: string;
    score: string;
    time: string;
    logoA: string;
    logoB: string;
    status: MatchStatus;
    startTime?: string;
    viewers?: number;
    league?: string;
}

export default function LiveMatches() {
    const router = useRouter();
    
    const matches: Match[] = [
    {
        id: "0x9afD47C8EE9e28aEc070ef148de21c24c7fE8195",
        teamA: "Barcelona",
        teamB: "Real Madrid",
        score: "2 - 1",
        time: "78'",
        logoA: "/barca.png",
        logoB: "/madrid.png",
        status: "LIVE",
        viewers: 2500000,
        league: "La Liga",
    },
    {
        id: "0x7aD47C8EE9e28aEc070ef148de21c24c7fE8195",
        teamA: "Manchester City",
        teamB: "Liverpool",
        score: "1 - 1",
        time: "56'",
        logoA: "/city.png",
        logoB: "/liverpool.png",
        status: "LIVE",
        viewers: 1800000,
        league: "Premier League",
    },
    {
        id: "0x5aD47C8EE9e28aEc070ef148de21c24c7fE8195",
        teamA: "Juventus",
        teamB: "AC Milan",
        score: "- - -",
        time: "Starts in 2h",
        logoA: "/juve.png",
        logoB: "/milan.png",
        status: "BET_OPEN",
        startTime: "20:00",
        league: "Serie A",
    },
    {
        id: "0x3aD47C8EE9e28aEc070ef148de21c24c7fE8195",
        teamA: "PSG",
        teamB: "Bayern Munich",
        score: "3 - 2",
        time: "FT",
        logoA: "/psg.png",
        logoB: "/bayern.png",
        status: "ENDED",
        league: "Champions League",
    },
    {
        id: "0x1aD47C8EE9e28aEc070ef148de21c24c7fE8195",
        teamA: "Chelsea",
        teamB: "Arsenal",
        score: "- - -",
        time: "Tomorrow 15:00",
        logoA: "/chelsea.png",
        logoB: "/arsenal.png",
        status: "BET_OPEN",
        startTime: "15:00",
        league: "Premier League",
    },
    {
        id: "0x0aD47C8EE9e28aEc070ef148de21c24c7fE8195",
        teamA: "Inter Milan",
        teamB: "Napoli",
        score: "1 - 0",
        time: "FT",
        logoA: "/inter.png",
        logoB: "/napoli.png",
        status: "ENDED",
        league: "Serie A",
    },
];

const statusPriority: Record<MatchStatus, number> = {
    LIVE: 0,
    BET_OPEN: 1,
    ENDED: 2,
};

const sortedMatches = [...matches].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
);

const statusConfig = (status: MatchStatus) => {
    switch (status) {
    case "LIVE":
        return {
        icon: Zap,
        text: "LIVE",
        bgColor: "bg-red-500/10",
        textColor: "text-red-400",
        borderColor: "border-red-500/30",
        glowColor: "shadow-red-500/20",
        animate: "animate-pulse",
        };
    case "BET_OPEN":
        return {
        icon: TrendingUp,
        text: "BET OPEN",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400",
        borderColor: "border-blue-500/30",
        glowColor: "shadow-blue-500/20",
        animate: "",
        };
    case "ENDED":
        return {
        icon: Trophy,
        text: "ENDED",
        bgColor: "bg-gray-500/10",
        textColor: "text-gray-400",
        borderColor: "border-gray-500/30",
        glowColor: "shadow-gray-500/10",
        animate: "",
        };
    }
};

const cardStyle = (status: MatchStatus) => {
    switch (status) {
    case "LIVE":
        return "bg-gradient-to-br from-red-950/40 via-gray-900/95 to-black/90 border-red-500/20 shadow-lg shadow-red-500/10";
    case "BET_OPEN":
        return "bg-gradient-to-br from-blue-950/40 via-gray-900/95 to-black/90 border-blue-500/20 shadow-lg shadow-blue-500/10";
    case "ENDED":
        return "bg-gradient-to-br from-gray-950/40 via-gray-900/95 to-black/90 border-gray-500/20 shadow-lg shadow-gray-500/10";
    }
};

const formatViewers = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
};

return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-4 md:px-8 py-16" style={{ fontFamily: "Lexend, sans-serif" }}>
    <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent">Live Matches</h1>
        <p className="text-gray-400 text-lg">Follow your favorite teams in real-time</p>
        </header>

        <section className="flex flex-wrap justify-center gap-6 mb-10">
        {(["LIVE", "BET_OPEN", "ENDED"] as MatchStatus[]).map((status) => {
            const cfg = statusConfig(status);
            const Icon = cfg.icon;
            return (
            <div key={status} className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md ${cfg.bgColor} ${cfg.borderColor} ${cfg.textColor} ${cfg.glowColor} transition-transform duration-300 hover:scale-105`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{cfg.text}</span>
            </div>
            );
        })}
        </section>

        <section className="grid gap-6 w-full">
        {sortedMatches.map((match) => {
            const cfg = statusConfig(match.status);
            const StatusIcon = cfg.icon;

            return (
            <article key={match.id} role="button" tabIndex={0} onClick={() => router.push(`/live/${match.id}`)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push(`/live/${match.id}`); }} className={`${cardStyle(match.status)} border rounded-3xl p-8 backdrop-blur-xl w-full cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
                </div>

                {match.league && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-300 border border-gray-700/50">
                    {match.league}
                </div>
                )}

                {match.status === "LIVE" && match.viewers && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 backdrop-blur-sm rounded-full text-xs font-medium text-red-400 border border-red-500/30">
                    <Eye className="w-3 h-3" />
                    <span>{formatViewers(match.viewers)}</span>
                </div>
                )}

                {match.status === "BET_OPEN" && (
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs font-medium text-blue-400 border border-blue-500/30">
                    <TrendingUp className="w-3 h-3" />
                    <span>Betting Open</span>
                </div>
                )}

                <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-8 flex-1">
                    <div className="flex items-center gap-4 flex-1 relative">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <Image src={match.logoA} alt={match.teamA} width={56} height={56} className="rounded-full border-2 border-gray-700/50 relative z-10 shadow-lg" />
                        {/* Fan Token A */}
                        {(() => {
                        const token = getFanToken(match.teamA);
                        if (!token) return null;
                        return (
                            <a href={token.link} target="_blank" rel="noopener noreferrer" className="absolute -bottom-2 -right-2 w-6 h-6">
                            <Image src={token.image} alt={token.symbol} width={24} height={24} className="rounded-full border border-gray-600 bg-black p-0.5" />
                            </a>
                        );
                        })()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl text-white group-hover:text-blue-100 transition-colors">{match.teamA}</span>
                        <span className="text-sm text-gray-400">Home</span>
                    </div>
                    </div>

                    <div className="flex flex-col items-center min-w-[120px] px-6">
                    <span className={`text-4xl font-bold transition-all duration-300 ${match.status === "BET_OPEN" ? "text-gray-600" : "text-white group-hover:scale-110 group-hover:text-blue-100"}`}>{match.score}</span>
                    {match.status === "BET_OPEN" && <span className="text-sm text-gray-500 mt-1 font-medium">vs</span>}
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end relative">
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-xl text-white group-hover:text-blue-100 transition-colors">{match.teamB}</span>
                        <span className="text-sm text-gray-400">Away</span>
                    </div>
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <Image src={match.logoB} alt={match.teamB} width={56} height={56} className="rounded-full border-2 border-gray-700/50 relative z-10 shadow-lg" />
                        {/* Fan Token B */}
                        {(() => {
                        const token = getFanToken(match.teamB);
                        if (!token) return null;
                        return (
                            <a href={token.link} target="_blank" rel="noopener noreferrer" className="absolute -bottom-2 -right-2 w-6 h-6">
                            <Image src={token.image} alt={token.symbol} width={24} height={24} className="rounded-full border border-gray-600 bg-black p-0.5" />
                            </a>
                        );
                        })()}
                    </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 ml-8">
                    <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-700 bg-black/40 text-xs font-semibold text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>{match.time}</span>
                    </div>

                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.textColor} ${cfg.bgColor} ${cfg.borderColor} ${cfg.glowColor} ${cfg.animate}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span>{cfg.text}</span>
                    </div>
                    </div>
                </div>
                </div>
            </article>
            );
        })}
        </section>
    </div>
    </div>
);
}

