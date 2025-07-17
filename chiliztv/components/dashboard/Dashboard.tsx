"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Edit,
    Wallet,
    Trophy,
    History,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

import SelfProtocolQRCode from "../selfProtcol/SelfProtocolQRCode";
import { useUserUpdateRequest, useDynamicContext } from "@dynamic-labs/sdk-react-core";

// Mock data
const mockUser = {
    username: "Disconnected",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    totalTokens: 15,
    totalPredictions: 127,
    winRate: 68.5,
    totalWinnings: 2456.78,
};

const mockFanTokens = [
  {
    id: 1,
    team: "Manchester United",
    symbol: "MUFC",
    quantity: 250,
    currentPrice: 12.45,
    change: 5.2,
    logo: "https://images.unsplash.com/photo-1566577134815-6d8b89e60e11?w=60&h=60&fit=crop&crop=center",
  },
  {
    id: 2,
    team: "FC Barcelona",
    symbol: "BAR",
    quantity: 180,
    currentPrice: 18.92,
    change: -2.8,
    logo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=60&h=60&fit=crop&crop=center",
  },
  {
    id: 3,
    team: "Real Madrid",
    symbol: "REAL",
    quantity: 320,
    currentPrice: 22.15,
    change: 8.7,
    logo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=60&h=60&fit=crop&crop=center",
  },
  {
    id: 4,
    team: "Liverpool FC",
    symbol: "LFC",
    quantity: 150,
    currentPrice: 16.33,
    change: 3.1,
    logo: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=60&h=60&fit=crop&crop=center",
  },
  {
    id: 5,
    team: "Chelsea FC",
    symbol: "CHE",
    quantity: 200,
    currentPrice: 14.87,
    change: -1.5,
    logo: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=60&h=60&fit=crop&crop=center",
  },
];

const mockBettingHistory = [
  {
    id: 1,
    date: "2025-01-10",
    match: "Manchester United vs Arsenal",
    bet: "Man United Win",
    stake: 50,
    odds: 2.4,
    result: "Won",
    payout: 120,
  },
  {
    id: 2,
    date: "2025-01-09",
    match: "Barcelona vs Real Madrid",
    bet: "Over 2.5 Goals",
    stake: 75,
    odds: 1.8,
    result: "Won",
    payout: 135,
  },
  {
    id: 3,
    date: "2025-01-08",
    match: "Liverpool vs Chelsea",
    bet: "Liverpool Win",
    stake: 100,
    odds: 1.9,
    result: "Lost",
    payout: 0,
  },
  {
    id: 4,
    date: "2025-01-07",
    match: "PSG vs Monaco",
    bet: "Both Teams to Score",
    stake: 30,
    odds: 1.6,
    result: "Won",
    payout: 48,
  },
  {
    id: 5,
    date: "2025-01-06",
    match: "Bayern Munich vs Dortmund",
    bet: "Win against Dortmund",
    stake: 60,
    odds: 2.1,
    result: "Lost",
    payout: 0,
  },
];

export function Dashboard() {
    const [username, setUsername] = useState("Unknown User");
    const [showVerificationDialog, setShowVerificationDialog] = useState(false);
    const [isClient, setIsClient] = useState(false);

    interface UserMetadata {
        winRate?: number;
    }

    interface User {
        username?: string;
        metadata?: UserMetadata;
    }

    const { primaryWallet, user } = useDynamicContext() as { primaryWallet?: { address?: string }; user?: User };
    const { updateUserWithModal } = useUserUpdateRequest();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (user?.username) {
        setUsername(user.username);
        }
    }, [user]);

    const formatNumber = (num: number) => {
        if (!isClient) return num.toString();
        return num.toLocaleString("en-US");
    };

    const totalTokenValue = mockFanTokens.reduce(
        (sum, token) => sum + token.quantity * token.currentPrice,
        0
    );

    return (
        <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h1 className="text-3xl font-bold mb-1">
                Profile
                </h1>
                <p className="text-white/70 text-sm">
                Welcome back, {user ? user.username || "Unknown User" : "Guest"}!
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30">VIP Member</Badge>
                <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 rounded-full px-3 py-1"
                onClick={() => setShowVerificationDialog(true)}
                >
                Verify to Withdraw
                </Button>
                {showVerificationDialog && (
                <SelfProtocolQRCode onClose={() => setShowVerificationDialog(false)} />
                )}
            </div>
            </div>

            {/* User Profile Card */}
            <Card className="mb-6 bg-gradient-to-r from-[#1a1919] to-[#0f0f0f] border-white/10">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    <Avatar className="w-16 h-16 border-2 border-primary/30">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" />
                    <AvatarFallback className="bg-primary/20 text-white text-xl font-bold">
                        {username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                    </Avatar>
                    <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl text-white font-bold">{username}</h2>
                        <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-white/60 hover:text-white"
                        onClick={() => updateUserWithModal(['username'])}
                        >
                        <Edit className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="text-white/60 text-sm font-mono truncate max-w-[220px]">
                        <Wallet className="inline-block w-4 h-4 mr-1" />
                        {primaryWallet?.address ? (
                            <span className="break-all">
                            {primaryWallet.address.slice(0, 6)}...{primaryWallet.address.slice(-4)}
                            </span>
                        ) : (
                        <span className="text-red-500">No wallet connected</span>
                        )}
                    </div>
                    <div className="text-sm text-white/70 flex gap-4 mt-1">
                        <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        Win Rate: {user?.metadata?.winRate ?? "N/A"}%
                        </div>
                        <span>Total Predictions: {mockUser.totalPredictions}</span>
                    </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">${formatNumber(mockUser.totalWinnings)}</p>
                    <p className="text-sm text-white/60">Total Winnings</p>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Fan Tokens" value={mockUser.totalTokens} icon={<Trophy className="w-6 h-6 text-white" />} />
            <StatCard title="Portfolio Value" value={`$${formatNumber(totalTokenValue)}`} icon={<TrendingUp className="w-6 h-6 text-green-500" />} />
            <StatCard title="Active Predictions" value={7} icon={<History className="w-6 h-6 text-blue-500" />} />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="tokens" className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-[#1a1919] border-white/10 mb-4">
                <TabsTrigger value="tokens" className="data-[state=active]:bg-primary text-white">Fan Tokens</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-primary text-white">Predictions History</TabsTrigger>
            </TabsList>

            <TabsContent value="tokens">
                <Card className="bg-[#0f0f0f] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Your Fan Tokens
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockFanTokens.map((token) => (
                        <TokenCard key={token.id} token={token} formatNumber={formatNumber} />
                    ))}
                    </div>
                </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="history">
                <Card className="bg-[#0f0f0f] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Recent Predictions History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow className="border-white/10">
                            {["Date", "Match", "Bet", "Stake", "Odds", "Result", "Payout"].map((heading) => (
                            <TableHead key={heading} className="text-white/80">{heading}</TableHead>
                            ))}
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {mockBettingHistory.map((bet) => (
                            <TableRow key={bet.id} className="border-white/10">
                            <TableCell className="text-white/80">{bet.date}</TableCell>
                            <TableCell className="text-white">{bet.match}</TableCell>
                            <TableCell className="text-white/80">{bet.bet}</TableCell>
                            <TableCell className="text-white/80">${bet.stake}</TableCell>
                            <TableCell className="text-white/80">{bet.odds}</TableCell>
                            <TableCell>
                                <Badge className={bet.result === "Won" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}>
                                {bet.result}
                                </Badge>
                            </TableCell>
                            <TableCell className={`font-bold ${bet.payout > 0 ? "text-green-500" : "text-red-500"}`}>
                                ${bet.payout}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
                </Card>
            </TabsContent>
            </Tabs>
        </div>
        </div>
    );
    }

    // StatCard Component
    function StatCard({ title, value, icon }: Readonly<{ title: string; value: string | number; icon: React.ReactNode }>) {
    return (
        <Card className="bg-gradient-to-br from-[#1a1919] to-[#0f0f0f] border-white/10">
        <CardContent className="p-4 flex justify-between items-center">
            <div>
            <p className="text-white text-sm mb-1">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">{icon}</div>
        </CardContent>
        </Card>
    );
    }

    // TokenCard Component
    function TokenCard({ token, formatNumber }: Readonly<{ token: typeof mockFanTokens[0]; formatNumber: (num: number) => string }>) {
    return (
        <Card className="bg-[#0f0f0f] border-white/10 hover:border-primary/30 transition-colors">
        <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
                <AvatarImage src={token.logo} alt={token.team} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {token.symbol}
                </AvatarFallback>
            </Avatar>
            <div>
                <h3 className="font-bold text-white text-sm">{token.team}</h3>
                <p className="text-white/60 text-xs">{token.symbol}</p>
            </div>
            </div>
            <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-white/60">Quantity</span>
                <span className="text-white font-bold">{token.quantity}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-white/60">Price</span>
                <span className="text-white font-bold">${token.currentPrice}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-white/60">Change</span>
                <div className="flex items-center gap-1">
                {token.change > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs font-bold ${token.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.change > 0 ? "+" : ""}
                    {token.change}%
                </span>
                </div>
            </div>
            <div className="pt-2 border-t border-white/10 mt-2 flex justify-between">
                <span className="text-white/60">Total Value</span>
                <span className="text-white font-bold">${formatNumber(token.quantity * token.currentPrice)}</span>
            </div>
            </div>
        </CardContent>
        </Card>
    );
}
