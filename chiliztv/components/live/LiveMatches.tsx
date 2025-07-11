"use client";
import { useRouter } from "next/navigation";
import { Clock, Trophy, Calendar, TrendingUp, Zap, Eye } from "lucide-react";
import Image from "next/image";

type MatchStatus = "LIVE" | "BET_OPEN" | "ENDED";

interface Match {
    id: number;
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
            id: 1,
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
            id: 2,
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
            id: 3,
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
            id: 4,
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
            id: 5,
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
            id: 6,
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

    // Sort matches by status priority: LIVE first, then BET_OPEN, then ENDED
    const sortedMatches = [...matches].sort((a, b) => {
        const statusOrder = { LIVE: 0, BET_OPEN: 1, ENDED: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    const getStatusConfig = (status: MatchStatus) => {
        switch (status) {
            case "LIVE":
                return {
                    icon: Zap,
                    text: "LIVE",
                    bgColor: "bg-red-500/10", // Primary accent for live
                    textColor: "text-red-400",
                    borderColor: "border-red-500/30",
                    glowColor: "shadow-red-500/20",
                    animate: "animate-pulse",
                };
            case "BET_OPEN":
                return {
                    icon: TrendingUp,
                    text: "BET OPEN",
                    bgColor: "bg-blue-500/10", // Primary color for betting
                    textColor: "text-blue-400",
                    borderColor: "border-blue-500/30",
                    glowColor: "shadow-blue-500/20",
                    animate: "",
                };
            case "ENDED":
                return {
                    icon: Trophy,
                    text: "ENDED",
                    bgColor: "bg-gray-500/10", // Neutral for ended matches
                    textColor: "text-gray-400",
                    borderColor: "border-gray-500/30",
                    glowColor: "shadow-gray-500/10",
                    animate: "",
                };
        }
    };

    const getMatchCardStyle = (status: MatchStatus) => {
        switch (status) {
            case "LIVE":
                return "bg-gradient-to-br from-red-950/40 via-gray-900/95 to-black/90 border-red-500/20 shadow-lg shadow-red-500/10";
            case "BET_OPEN":
                return "bg-gradient-to-br from-blue-950/40 via-gray-900/95 to-black/90 border-blue-500/20 shadow-lg shadow-blue-500/10";
            case "ENDED":
                return "bg-gradient-to-br from-gray-950/40 via-gray-900/95 to-black/90 border-gray-500/20 shadow-lg shadow-gray-500/10";
        }
    };

    const formatViewers = (viewers: number) => {
        if (viewers >= 1000000) {
            return `${(viewers / 1000000).toFixed(1)}M`;
        } else if (viewers >= 1000) {
            return `${(viewers / 1000).toFixed(1)}K`;
        }
        return viewers.toString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-4 md:px-8 py-16" style={{ fontFamily: "Lexend, sans-serif" }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent">
                        Live Matches
                    </h1>
                    <p className="text-gray-400 text-lg">Follow your favorite teams in real-time</p>
                </div>

                {/* Status Legend */}
                <div className="flex flex-wrap justify-center gap-6 mb-10">
                    {(["LIVE", "BET_OPEN", "ENDED"] as MatchStatus[]).map((status) => {
                        const config = getStatusConfig(status);
                        const Icon = config.icon;
                        return (
                            <div
                                key={status}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md ${config.bgColor} ${config.borderColor} ${config.textColor} ${config.glowColor} transition-all duration-300 hover:scale-105`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-semibold">{config.text}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Match Cards */}
                <div className="grid gap-6 w-full">
                    {sortedMatches.map((match) => {
                        const statusConfig = getStatusConfig(match.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div
                                key={match.id}
                                className={`${getMatchCardStyle(match.status)} border rounded-3xl p-8 backdrop-blur-xl w-full cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group relative overflow-hidden`}
                                onClick={() => router.push(`/live/${match.id}`)}
                            >
                                {/* Background pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
                                </div>

                                {/* League badge */}
                                {match.league && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-300 border border-gray-700/50">
                                        {match.league}
                                    </div>
                                )}

                                {/* Live viewers for live matches */}
                                {match.status === "LIVE" && match.viewers && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 backdrop-blur-sm rounded-full text-xs font-medium text-red-400 border border-red-500/30">
                                        <Eye className="w-3 h-3" />
                                        <span>{formatViewers(match.viewers)}</span>
                                    </div>
                                )}

                                {/* Bet open indicator */}
                                {match.status === "BET_OPEN" && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs font-medium text-blue-400 border border-blue-500/30">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>Betting Open</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-8">
                                    {/* Teams Section */}
                                    <div className="flex items-center gap-8 flex-1">
                                        {/* Team A */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative group-hover:scale-110 transition-transform duration-300">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <Image 
                                                    src={match.logoA} 
                                                    alt={match.teamA} 
                                                    width={56} 
                                                    height={56} 
                                                    className="rounded-full border-2 border-gray-700/50 relative z-10 shadow-lg" 
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xl text-white group-hover:text-blue-100 transition-colors">
                                                    {match.teamA}
                                                </span>
                                                <span className="text-sm text-gray-400">Home</span>
                                            </div>
                                        </div>
                                        
                                        {/* Score */}
                                        <div className="flex flex-col items-center min-w-[120px] px-6">
                                            <span className={`text-4xl font-bold transition-all duration-300 ${
                                                match.status === "BET_OPEN" 
                                                    ? "text-gray-600" 
                                                    : "text-white group-hover:scale-110 group-hover:text-blue-100"
                                            }`}>
                                                {match.score}
                                            </span>
                                            {match.status === "BET_OPEN" && (
                                                <span className="text-sm text-gray-500 mt-1 font-medium">vs</span>
                                            )}
                                        </div>
                                        
                                        {/* Team B */}
                                        <div className="flex items-center gap-4 flex-1 justify-end">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-xl text-white group-hover:text-blue-100 transition-colors">
                                                    {match.teamB}
                                                </span>
                                                <span className="text-sm text-gray-400">Away</span>
                                            </div>
                                            <div className="relative group-hover:scale-110 transition-transform duration-300">
                                                <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <Image 
                                                    src={match.logoB} 
                                                    alt={match.teamB} 
                                                    width={56} 
                                                    height={56} 
                                                    className="rounded-full border-2 border-gray-700/50 relative z-10 shadow-lg" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Match Info */}
                                    <div className="flex flex-col items-end gap-3 ml-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-700/50">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-medium">{match.time}</span>
                                            </div>
                                            
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border backdrop-blur-md ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor} ${statusConfig.glowColor} ${statusConfig.animate}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                <span>{statusConfig.text}</span>
                                            </div>
                                        </div>
                                        
                                        {match.startTime && match.status === "BET_OPEN" && (
                                            <div className="flex items-center gap-2 text-sm text-blue-400/80 bg-blue-500/10 px-3 py-1 rounded-full backdrop-blur-sm border border-blue-500/20">
                                                <Calendar className="w-4 h-4" />
                                                <span>Kickoff: {match.startTime}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}