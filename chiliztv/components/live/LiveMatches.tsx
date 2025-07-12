/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useRouter } from "next/navigation";
import { Clock, Trophy, TrendingUp, Zap, Eye, RefreshCw } from "lucide-react";
import Image from "next/image";
import { getFanToken } from "@/utils/FanTokens";
import { MatchService } from "@/services/match.service";
import { IMatchId } from "@/models/match.model";
import { useEffect, useState } from "react";

type MatchStatus = "LIVE" | "BET_OPEN" | "ENDED";

interface MatchDisplay extends IMatchId {
    displayStatus: MatchStatus;
    time: string;
    viewers?: number;
    logoA: string;
    logoB: string;
}

export default function LiveMatches() {
    const router = useRouter();
    const [matches, setMatches] = useState<MatchDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [error, setError] = useState<string | null>(null);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await MatchService.getAllMatches();
            
            console.log("API Response:", result);
            console.log("Result errorCode:", result.errorCode);
            console.log("Result result:", result.result);
            
            const mockMatch: MatchDisplay = {
                id: 1,
                api_football_id: 1,
                home_team: "PSG",
                away_team: "Inter Milan",
                home_score: null,
                away_score: null,
                match_date: "2025-06-01T20:00:00Z",
                status: "Not Started",
                league: "Champions League",
                season: "2024/2025",
                venue: "Wembley Stadium, London",
                referee: "Anthony Taylor",
                odds: {
                    match_winner: {
                        home: 2.10,
                        draw: 3.20,
                        away: 3.50
                    },
                    over_under: {
                        over_0_5: 1.15,
                        over_1_5: 1.85,
                        over_2_5: 2.75,
                        over_3_5: 4.50,
                        over_4_5: 8.00,
                        under_0_5: 5.50,
                        under_1_5: 1.95,
                        under_2_5: 1.45,
                        under_3_5: 1.22,
                        under_4_5: 1.08
                    },
                    both_teams_score: {
                        yes: 1.75,
                        no: 2.10
                    }
                },
                displayStatus: "BET_OPEN",
                time: "in 6h 30m",
                logoA: "/psg.png",
                logoB: "/inter.png",
                viewers: undefined
            };
            
            let allMatches: MatchDisplay[] = [mockMatch];
            
            if (result.errorCode === 0 && result.result && result.result.length > 0) {
                console.log("Processing real matches...");
                const processedMatches = result.result.map(match => {
                    const status = getMatchStatus(match);
                    const time = getMatchTime(match);
                    
                    return {
                        ...match,
                        displayStatus: status,
                        time,
                        logoA: match.teams?.home?.logo || getTeamLogo(match.home_team),
                        logoB: match.teams?.away?.logo || getTeamLogo(match.away_team),
                        viewers: status === "LIVE" ? Math.floor(Math.random() * 3000000) + 500000 : undefined
                    };
                });
                
                allMatches = [mockMatch, ...processedMatches];
            } else {
                console.log("No real matches found, showing only mock match...");
            }
            
            setMatches(allMatches);
            setLastUpdate(new Date());
        } catch (err) {
            console.error("Error fetching matches:", err);
            setError("Error loading matches");
        } finally {
            setLoading(false);
        }
    };

    const getMatchStatus = (match: IMatchId): MatchStatus => {
        const now = new Date();
        const matchDate = new Date(match.match_date);
        const matchEnd = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
        
        if (match.status === "Match Finished" || match.status === "FT" || match.status === "AET" || match.status === "PEN") {
            return "ENDED";
        }
        
        if (match.status === "1H" || match.status === "2H" || match.status === "HT" || match.status === "LIVE") {
            return "LIVE";
        }
        
        if (now < matchDate) {
            return "BET_OPEN";
        }
        
        return "ENDED";
    };

    const getMatchTime = (match: IMatchId): string => {
        const now = new Date();
        const matchDate = new Date(match.match_date);
        
        if (match.status === "Match Finished" || match.status === "FT") {
            return "FT";
        }
        
        if (match.status === "1H") {
            const elapsed = Math.floor((now.getTime() - matchDate.getTime()) / (1000 * 60));
            return `${elapsed}'`;
        }
        
        if (match.status === "2H") {
            const elapsed = Math.floor((now.getTime() - matchDate.getTime()) / (1000 * 60)) + 45;
            return `${elapsed}'`;
        }
        
        if (match.status === "HT") {
            return "HT";
        }
        
        if (now < matchDate) {
            const diff = matchDate.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hours > 24) {
                const days = Math.floor(hours / 24);
                return `in ${days}d`;
            } else if (hours > 0) {
                return `in ${hours}h ${minutes}m`;
            } else {
                return `in ${minutes}m`;
            }
        }
        
        return "TBD";
    };

    const getTeamLogo = (teamName: string): string => {
        const token = getFanToken(teamName);
        return token?.image || "/default-team.png";
    };

    useEffect(() => {
        fetchMatches();
        
        const interval = setInterval(fetchMatches, 600000);
        
        return () => clearInterval(interval);
    }, []);

    const statusPriority: Record<MatchStatus, number> = {
        LIVE: 0,
        BET_OPEN: 1,
        ENDED: 2,
    };

    const sortedMatches = [...matches].sort(
        (a, b) => statusPriority[a.displayStatus] - statusPriority[b.displayStatus]
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

    const formatScore = (match: MatchDisplay) => {
        if (match.home_score !== null && match.away_score !== null) {
            return `${match.home_score} - ${match.away_score}`;
        }
        return "- - -";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
                    <p className="text-gray-400">Loading matches...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-4 md:px-8 py-16 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button 
                        onClick={fetchMatches}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-4 md:px-8 py-16" style={{ fontFamily: "Lexend, sans-serif" }}>
        <div className="max-w-6xl mx-auto">
            <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent">Live Matches</h1>
            <p className="text-gray-400 text-lg">Follow your favorite teams in real-time</p>
            <div className="mt-4 text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()} | Auto-refresh every 10 minutes
            </div>
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
                const cfg = statusConfig(match.displayStatus);
                const StatusIcon = cfg.icon;

                return (
                <article key={match.id} role="button" tabIndex={0} onClick={() => router.push(`/live/${match.id}`)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") router.push(`/live/${match.id}`); }} className={`${cardStyle(match.displayStatus)} border rounded-3xl p-8 backdrop-blur-xl w-full cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
                    </div>

                    {match.league && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-300 border border-gray-700/50">
                        {match.league}
                    </div>
                    )}

                    {match.displayStatus === "LIVE" && match.viewers && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 backdrop-blur-sm rounded-full text-xs font-medium text-red-400 border border-red-500/30">
                        <Eye className="w-3 h-3" />
                        <span>{formatViewers(match.viewers)}</span>
                    </div>
                    )}

                    {match.displayStatus === "BET_OPEN" && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-full text-xs font-medium text-blue-400 border border-blue-500/30">
                        <TrendingUp className="w-3 h-3" />
                        <span>Betting Open</span>
                    </div>
                    )}

                    <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center gap-8 flex-1">
                        <div className="flex items-center gap-4 flex-1 relative">
                        <div className="relative group-hover:scale-110 transition-transform duration-300">
                            <Image src={match.logoA} alt={match.home_team} width={56} height={56} className="rounded-full border-2 border-gray-700/50 relative z-10 shadow-lg" />
                            {/* Fan Token A */}
                            {(() => {
                            const token = getFanToken(match.home_team);
                            if (!token) return null;
                            return (
                                <a href={token.link} target="_blank" rel="noopener noreferrer" className="absolute -bottom-2 -right-2 w-6 h-6">
                                <Image src={token.image} alt={token.symbol} width={24} height={24} className="rounded-full border border-gray-600 bg-black p-0.5" />
                                </a>
                            );
                            })()}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-white group-hover:text-blue-100 transition-colors">{match.home_team}</span>
                            <span className="text-sm text-gray-400">Home</span>
                        </div>
                        </div>

                        <div className="flex flex-col items-center min-w-[120px] px-6">
                        <span className={`text-4xl font-bold transition-all duration-300 ${match.displayStatus === "BET_OPEN" ? "text-gray-600" : "text-white group-hover:scale-110 group-hover:text-blue-100"}`}>{formatScore(match)}</span>
                        {match.displayStatus === "BET_OPEN" && <span className="text-sm text-gray-500 mt-1 font-medium">vs</span>}
                        </div>

                        <div className="flex items-center gap-4 flex-1 justify-end relative">
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-xl text-white group-hover:text-blue-100 transition-colors">{match.away_team}</span>
                            <span className="text-sm text-gray-400">Away</span>
                        </div>
                        <div className="relative group-hover:scale-110 transition-transform duration-300">
                            <Image src={match.logoB} alt={match.away_team} width={56} height={56} className="rounded-full border-2 border-gray-700/50 relative z-10 shadow-lg" />
                            {/* Fan Token B */}
                            {(() => {
                            const token = getFanToken(match.away_team);
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

            {sortedMatches.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No matches available at the moment</p>
                    <button 
                        onClick={fetchMatches}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            )}
        </div>
        </div>
    );
}

