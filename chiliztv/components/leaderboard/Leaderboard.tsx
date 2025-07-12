"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Trophy, Medal, Award, Crown, Star, Target, Zap } from "lucide-react";
import { getAllFanTokens } from "@/utils/FanTokens";
import Image from "next/image";
import { MonthlyCashPrizePool } from "./MonthlyCashPrizePool";

const mockTopBettors = [
    {
      rank: 1,
      username: "FootballKing",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 45230.50,
      winRate: 78.5,
      totalBets: 342,
      favoriteTeam: "PSG",
      streak: 12
    },
    {
      rank: 2,
      username: "BetMaster2024",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 38920.75,
      winRate: 74.2,
      totalBets: 298,
      favoriteTeam: "BAR",
      streak: 8
    },
    {
      rank: 3,
      username: "ChampionBetter",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 32156.90,
      winRate: 71.8,
      totalBets: 267,
      favoriteTeam: "JUV",
      streak: 5
    },
    {
      rank: 4,
      username: "StrategyGuru",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 28775.25,
      winRate: 69.3,
      totalBets: 245,
      favoriteTeam: "PSG",
      streak: 15
    },
    {
      rank: 5,
      username: "LiveBetPro",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 25890.40,
      winRate: 67.1,
      totalBets: 223,
      favoriteTeam: "BAR",
      streak: 3
    },
    {
      rank: 6,
      username: "GoalPredictor",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 23456.80,
      winRate: 65.9,
      totalBets: 201,
      favoriteTeam: "JUV",
      streak: 7
    },
    {
      rank: 7,
      username: "MatchAnalyst",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 21234.15,
      winRate: 64.2,
      totalBets: 189,
      favoriteTeam: "PSG",
      streak: 2
    },
    {
      rank: 8,
      username: "BettingLegend",
      avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 19876.50,
      winRate: 62.8,
      totalBets: 176,
      favoriteTeam: "BAR",
      streak: 9
    },
    {
      rank: 9,
      username: "SportsFanatic",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 18567.30,
      winRate: 61.5,
      totalBets: 164,
      favoriteTeam: "JUV",
      streak: 4
    },
    {
      rank: 10,
      username: "WinStreakHero",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=64&h=64&fit=crop&crop=face",
      totalWinnings: 17234.70,
      winRate: 60.1,
      totalBets: 152,
      favoriteTeam: "PSG",
      streak: 6
    }
  ];
  
  const mockTopTokenHolders = [
    {
      rank: 1,
      username: "TokenCollector",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face",
      totalTokens: 15420,
      portfolioValue: 89234.50,
      topToken: "PSG",
      tokensHeld: 3
    },
    {
      rank: 2,
      username: "FanTokenKing",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c77073b3?w=64&h=64&fit=crop&crop=face",
      totalTokens: 12850,
      portfolioValue: 76890.25,
      topToken: "BAR",
      tokensHeld: 3
    },
    {
      rank: 3,
      username: "PortfolioMaster",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop&crop=face",
      totalTokens: 11234,
      portfolioValue: 65432.10,
      topToken: "JUV",
      tokensHeld: 2
    },
    {
      rank: 4,
      username: "InvestorPro",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      totalTokens: 9876,
      portfolioValue: 54321.80,
      topToken: "PSG",
      tokensHeld: 3
    },
    {
      rank: 5,
      username: "TokenTrader",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      totalTokens: 8765,
      portfolioValue: 48750.60,
      topToken: "BAR",
      tokensHeld: 2
    }
  ];

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState("bettors");
  const fanTokens = getAllFanTokens();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-[18px] font-bold text-white/60">#{rank}</span>;
    }
  };

  const getTokenLogo = (tokenSymbol: string) => {
    const token = fanTokens.find((t: { symbol: string }) => t.symbol === tokenSymbol);
    return token?.image ?? `https://via.placeholder.com/24?text=${tokenSymbol}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Header */}
            <div className="text-center mb-8 px-2 sm:px-0">
            <h1
                className="text-[32px] sm:text-[40px] font-bold text-white mb-3 sm:mb-4"
                style={{ fontFamily: "Lexend, sans-serif" }}
            >
                🏆 Leaderboard
            </h1>
            <p
            className="text-white/70 text-[16px] sm:text-[18px] max-w-2xl mx-auto"
            style={{ fontFamily: "Lexend, sans-serif" }}
            >
            Compete with the best bettors and fan token collectors on{' '}
            <span style={{ display: 'inline-flex', verticalAlign: 'middle', margin: '0 4px' }}>
                <Image
                src="/chiliz_icon.png"
                alt="Chiliz Icon"
                width={20}
                height={20}
                style={{ display: 'block' }}
                />
            </span>{' '}
            ChilizTV. Climb the ranks and earn exclusive rewards!
            </p>


        </div>

        <MonthlyCashPrizePool />

        {/* Achievement Badges Section */}
        <Card className="mt-6 sm:mt-8 bg-gradient-to-r from-[#1a1919] to-[#0f0f0f] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
              <Star className="w-5 h-5 text-primary" />
              Monthly Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Each badge */}
              <div className="text-center p-4 bg-gradient-to-b from-yellow-500/20 to-yellow-600/5 rounded-lg border border-yellow-500/20">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1 text-base sm:text-lg">Champion</h4>
                <p className="text-yellow-500 text-sm sm:text-base">Most wins this month</p>
                <p className="text-white/60 text-xs sm:text-sm mt-1">FootballKing - 127 wins</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-blue-500/20 to-blue-600/5 rounded-lg border border-blue-500/20">
                <Target className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1 text-base sm:text-lg">Sharpshooter</h4>
                <p className="text-blue-500 text-sm sm:text-base">Highest accuracy</p>
                <p className="text-white/60 text-xs sm:text-sm mt-1">StrategyGuru - 89.2%</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-purple-500/20 to-purple-600/5 rounded-lg border border-purple-500/20">
                <Zap className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-1 text-base sm:text-lg">Speed Demon</h4>
                <p className="text-purple-500 text-sm sm:text-base">Fastest live bets</p>
                <p className="text-white/60 text-xs sm:text-sm mt-1">LiveBetPro - 0.3s avg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8 sm:mt-10">
          <TabsList className="grid w-full grid-cols-2 bg-[#1a1919] border-white/10 mb-6 rounded-md overflow-hidden">
            <TabsTrigger value="bettors" className="data-[state=active]:bg-primary text-white py-2 sm:py-3">
              🎯 Top Bettors
            </TabsTrigger>
            <TabsTrigger value="tokens" className="data-[state=active]:bg-primary text-white py-2 sm:py-3">
              💎 Token Holders
            </TabsTrigger>
          </TabsList>

          {/* Top Bettors Tab */}
          <TabsContent value="bettors">
            <Card className="bg-gradient-to-br from-[#1a1919] to-[#0f0f0f] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                  <Trophy className="w-5 h-5 text-primary" />
                  Top Bettors This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopBettors.map((bettor) => (
                    <div
                      key={bettor.rank}
                      className={`p-4 sm:p-6 rounded-lg border transition-all duration-300 hover:border-primary/30 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 ${
                        bettor.rank <= 3
                          ? "bg-gradient-to-r from-primary/10 to-[#FF3465]/10 border-primary/20"
                          : "bg-[#0f0f0f] border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                          {getRankIcon(bettor.rank)}
                        </div>
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-white/10">
                          <AvatarImage src={bettor.avatar} alt={bettor.username} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {bettor.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-grow text-center sm:text-left">
                        <h3
                          className="font-bold text-white text-sm sm:text-[16px]"
                          style={{ fontFamily: "Lexend, sans-serif" }}
                        >
                          {bettor.username}
                        </h3>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs sm:text-sm text-white/60 mt-1">
                          <div className="flex items-center gap-1">
                            <img
                              src={getTokenLogo(bettor.favoriteTeam)}
                              alt={bettor.favoriteTeam}
                              className="w-4 h-4 rounded-full"
                            />
                            <span>Fan of {bettor.favoriteTeam}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{bettor.streak} win streak</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center sm:text-right flex-shrink-0 min-w-[110px]">
                        <div className="text-lg sm:text-[20px] font-bold text-green-400 whitespace-nowrap">
                          ${bettor.totalWinnings.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-white/60">
                          {bettor.winRate}% win rate • {bettor.totalBets} bets
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Token Holders Tab */}
          <TabsContent value="tokens">
            <Card className="bg-gradient-to-br from-[#1a1919] to-[#0f0f0f] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                  <Award className="w-5 h-5 text-primary" />
                  Top Fan Token Holders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopTokenHolders.map((holder) => (
                    <div
                      key={holder.rank}
                      className={`p-4 sm:p-6 rounded-lg border transition-all duration-300 hover:border-primary/30 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 ${
                        holder.rank <= 3
                          ? "bg-gradient-to-r from-primary/10 to-[#FF3465]/10 border-primary/20"
                          : "bg-[#0f0f0f] border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                          {getRankIcon(holder.rank)}
                        </div>
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-white/10">
                          <AvatarImage src={holder.avatar} alt={holder.username} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {holder.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-grow text-center sm:text-left">
                        <h3
                          className="font-bold text-white text-sm sm:text-[16px]"
                          style={{ fontFamily: "Lexend, sans-serif" }}
                        >
                          {holder.username}
                        </h3>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs sm:text-sm text-white/60 mt-1">
                          <div className="flex items-center gap-1">
                            <img
                              src={getTokenLogo(holder.topToken)}
                              alt={holder.topToken}
                              className="w-4 h-4 rounded-full"
                            />
                            <span>Top: {holder.topToken}</span>
                          </div>
                          <span>{holder.tokensHeld} different tokens</span>
                        </div>
                      </div>
                      <div className="text-center sm:text-right flex-shrink-0 min-w-[110px]">
                        <div className="text-lg sm:text-[20px] font-bold text-blue-400 whitespace-nowrap">
                          {holder.totalTokens.toLocaleString()} tokens
                        </div>
                        <div className="text-xs sm:text-sm text-white/60">
                          ${holder.portfolioValue.toLocaleString()} value
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
