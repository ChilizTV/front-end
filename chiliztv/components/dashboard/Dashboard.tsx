"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    Card,  
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Wallet, Trophy, History, TrendingUp, TrendingDown } from "lucide-react";

// Mock data
const mockUser = {
    username: "FootballFan2024",
    walletAddress: "0x742d35Cc6634C0532925a3b8D3Ac92d9d3456789",
    totalTokens: 15,
    totalBets: 127,
    winRate: 68.5,
    totalWinnings: 2456.78
};

const mockFanTokens = [
    {
        id: 1,
        team: "Manchester United",
        symbol: "MUFC",
        quantity: 250,
        currentPrice: 12.45,
        change: 5.2,
        logo: "https://images.unsplash.com/photo-1566577134815-6d8b89e60e11?w=60&h=60&fit=crop&crop=center"
    },
    {
        id: 2,
        team: "FC Barcelona",
        symbol: "BAR",
        quantity: 180,
        currentPrice: 18.92,
        change: -2.8,
        logo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=60&h=60&fit=crop&crop=center"
    },
    {
        id: 3,
        team: "Real Madrid",
        symbol: "REAL",
        quantity: 320,
        currentPrice: 22.15,
        change: 8.7,
        logo: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=60&h=60&fit=crop&crop=center"
    },
    {
        id: 4,
        team: "Liverpool FC",
        symbol: "LFC",
        quantity: 150,
        currentPrice: 16.33,
        change: 3.1,
        logo: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=60&h=60&fit=crop&crop=center"
    },
    {
        id: 5,
        team: "Chelsea FC",
        symbol: "CHE",
        quantity: 200,
        currentPrice: 14.87,
        change: -1.5,
        logo: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=60&h=60&fit=crop&crop=center"
    }
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
        payout: 120
    },
    {
        id: 2,
        date: "2025-01-09",
        match: "Barcelona vs Real Madrid",
        bet: "Over 2.5 Goals",
        stake: 75,
        odds: 1.8,
        result: "Won",
        payout: 135
    },
    {
        id: 3,
        date: "2025-01-08",
        match: "Liverpool vs Chelsea",
        bet: "Liverpool Win",
        stake: 100,
        odds: 1.9,
        result: "Lost",
        payout: 0
    },
    {
        id: 4,
        date: "2025-01-07",
        match: "PSG vs Monaco",
        bet: "Both Teams to Score",
        stake: 30,
        odds: 1.6,
        result: "Won",
        payout: 48
    },
    {
        id: 5,
        date: "2025-01-06",
        match: "Bayern Munich vs Dortmund",
        bet: "Under 3.5 Goals",
        stake: 60,
        odds: 2.1,
        result: "Lost",
        payout: 0
    }
];

export function Dashboard() {
    const [username, setUsername] = useState(mockUser.username);
    const [tempUsername, setTempUsername] = useState(username);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleUsernameUpdate = () => {
        const newUsername = tempUsername.trim();
        if (newUsername && newUsername !== username) {
            setUsername(newUsername);
            // Here you would typically make an API call to update the username in your backend
            console.log(`Username updated to: ${newUsername}`);
        } else {
            console.log("Username not changed or invalid");
        }

        // const updatedUser = {
        //     ...user,
        //     username: newUsername
        // };
        
        setIsDialogOpen(false);
    };

    const totalTokenValue = mockFanTokens.reduce((sum, token) => sum + (token.quantity * token.currentPrice), 0);

    return (
        <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-[32px] font-bold text-white mb-2" style={{ fontFamily: 'Lexend, sans-serif' }}>
                Dashboard
                </h1>
                <p className="text-white/70" style={{ fontFamily: 'Lexend, sans-serif' }}>
                Welcome back, {username}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                VIP Member
                </Badge>
            </div>
            </div>

            {/* User Profile Card */}
            <Card className="mb-8 bg-gradient-to-r from-[#1a1919] to-[#0f0f0f] border-white/10">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20 border-2 border-primary/30">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
                        {username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                    </Avatar>
                    <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-[24px] font-bold text-white" style={{ fontFamily: 'Lexend, sans-serif' }}>
                        {username}
                        </h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white p-1">
                            <Edit className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1a1919] border-white/10">
                            <DialogHeader>
                            <DialogTitle className="text-white" style={{ fontFamily: 'Lexend, sans-serif' }}>
                                Update Username
                            </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                            <div>
                                <Label htmlFor="username" className="text-white/80">New Username</Label>
                                <Input
                                id="username"
                                value={tempUsername}
                                onChange={(e) => setTempUsername(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="Enter new username"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleUsernameUpdate} className="bg-primary hover:bg-primary/90">
                                Update
                                </Button>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/20 text-white">
                                Cancel
                                </Button>
                            </div>
                            </div>
                        </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                        <Wallet className="w-4 h-4" />
                        <span className="font-mono text-sm">{mockUser.walletAddress}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-white/80">Win Rate: {mockUser.winRate}%</span>
                        </div>
                        <div className="text-white/80">
                        Total Bets: {mockUser.totalBets}
                        </div>
                    </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[24px] font-bold text-green-400 mb-1">
                    ${mockUser.totalWinnings.toLocaleString()}
                    </div>
                    <div className="text-white/60 text-sm">Total Winnings</div>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-[#1a1919] to-[#0f0f0f] border-white/10">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-white/60 text-sm mb-1">Fan Tokens</p>
                    <p className="text-[24px] font-bold text-white">{mockUser.totalTokens}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#1a1919] to-[#0f0f0f] border-white/10">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-white/60 text-sm mb-1">Portfolio Value</p>
                    <p className="text-[24px] font-bold text-white">${totalTokenValue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                </div>
                </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#1a1919] to-[#0f0f0f] border-white/10">
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-white/60 text-sm mb-1">Active Bets</p>
                    <p className="text-[24px] font-bold text-white">7</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <History className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                </CardContent>
            </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="tokens" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1a1919] border-white/10 mb-6">
                <TabsTrigger value="tokens" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Fan Tokens
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Betting History
                </TabsTrigger>
            </TabsList>

            {/* Fan Tokens Tab */}
            <TabsContent value="tokens">
                <Card className="bg-gradient-to-br from-[#1a1919] to-[#0f0f0f] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Your Fan Tokens
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockFanTokens.map((token) => (
                        <Card key={token.id} className="bg-[#0f0f0f] border-white/10 hover:border-primary/30 transition-colors">
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
                            <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-white/60 text-xs">Quantity</span>
                                <span className="text-white font-bold">{token.quantity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/60 text-xs">Price</span>
                                <span className="text-white font-bold">${token.currentPrice}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white/60 text-xs">Change</span>
                                <div className="flex items-center gap-1">
                                {token.change > 0 ? (
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                ) : (
                                    <TrendingDown className="w-3 h-3 text-red-500" />
                                )}
                                <span className={`text-xs font-bold ${token.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {token.change > 0 ? '+' : ''}{token.change}%
                                </span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                <span className="text-white/60 text-xs">Total Value</span>
                                <span className="text-white font-bold">${(token.quantity * token.currentPrice).toLocaleString()}</span>
                                </div>
                            </div>
                            </div>
                        </CardContent>
                        </Card>
                    ))}
                    </div>
                </CardContent>
                </Card>
            </TabsContent>

            {/* Betting History Tab */}
            <TabsContent value="history">
                <Card className="bg-gradient-to-br from-[#1a1919] to-[#0f0f0f] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Recent Betting History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow className="border-white/10">
                            <TableHead className="text-white/80">Date</TableHead>
                            <TableHead className="text-white/80">Match</TableHead>
                            <TableHead className="text-white/80">Bet</TableHead>
                            <TableHead className="text-white/80">Stake</TableHead>
                            <TableHead className="text-white/80">Odds</TableHead>
                            <TableHead className="text-white/80">Result</TableHead>
                            <TableHead className="text-white/80">Payout</TableHead>
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
                                <Badge className={bet.result === 'Won' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                                {bet.result}
                                </Badge>
                            </TableCell>
                            <TableCell className={`font-bold ${bet.payout > 0 ? 'text-green-500' : 'text-red-500'}`}>
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