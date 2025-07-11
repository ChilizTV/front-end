"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FAN_TOKENS } from "@/utils/FanTokens";
import { TrendingUp, DollarSign } from "lucide-react";

interface BetDialogProps {
    isLoggedIn: boolean;
    onLogin: () => void;
    onBetPlaced?: (team: string, amount: string) => void;
    TeamA: string;
    TeamB: string;
}

export default function BetDialog({
    isLoggedIn,
    onLogin,
    onBetPlaced,
    TeamA,
    TeamB,
}: BetDialogProps) {
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [betAmount, setBetAmount] = useState("");

    const handleBet = () => {
        if (selectedTeam && betAmount.trim()) {
        console.log(`Bet placed: $${betAmount} USD on ${selectedTeam}`);
        onBetPlaced?.(selectedTeam, betAmount);
        setSelectedTeam(null);
        setBetAmount("");
        }
    };

    const getTeamData = (team: string) =>
        FAN_TOKENS.find((token) => token[team])?.[team];

    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button className="w-full bg-primary/80 hover:bg-primary/90 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105">
                <TrendingUp className="w-4 h-4 mr-2" />
                Place Bet
            </Button>
        </DialogTrigger>

        <DialogContent className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white border border-white/20 max-w-md shadow-2xl backdrop-blur-sm">
            {/* Header with gradient border */}
            <DialogHeader className="relative">
                <div className="absolute inset-0 rounded-t-lg blur-sm"></div>
                <DialogTitle className="text-2xl text-center font-bold bg-clip-text text-transparent relative z-10 py-4 text-white">
                    Place Your Bet
                </DialogTitle>
            </DialogHeader>

            {/* Amount Input with enhanced styling */}
            <div className="relative mt-6">
                <div className="absolute inset-0 rounded-lg blur-sm"></div>
                <div className="relative bg-zinc-800/80 backdrop-blur-sm rounded-lg border border-white/10 p-4">
                    <div className="flex items-center justify-center mb-2">
                        <span className="text-sm text-zinc-400 font-medium">Bet Amount (USD)</span>
                    </div>
                    <Input
                        type="number"
                        min="1"
                        placeholder="0.00"
                        className="text-center text-4xl font-bold py-6 bg-transparent text-white border-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-zinc-600"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                    />
                </div>
            </div>

            {/* Team Selection with enhanced cards */}
            <div className="mt-8">
                <div className="text-center mb-4">
                    <span className="text-sm text-zinc-400 font-medium">Select Team</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[TeamA, TeamB].map((team) => {
                        const data = getTeamData(team);
                        const symbol = data?.symbol || team;
                        const image = data?.image || "";
                        const isSelected = selectedTeam === symbol;

                        return (
                            <div key={team} className="relative">
                                {isSelected && (
                                    <div className="absolute inset-0 bg-primary/10 rounded-lg shadow-lg transition-all duration-300"></div>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedTeam(symbol)}
                                    className={`relative w-full h-20 flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                                        isSelected 
                                            ? 'bg-primary/20 border-emerald-500 text-emerald-300 hover:bg-primary/30 hover:border-secondary'
                                            : 'bg-zinc-800/50 border-white/10 text-zinc-300 hover:bg-zinc-700/50 hover:border-white/20'
                                    }`}
                                >
                                    {image && (
                                        <div className={`p-1 rounded-full transition-all duration-300 ${
                                            isSelected ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30' : 'bg-zinc-700/50'
                                        }`}>
                                            <Image
                                                src={image}
                                                alt={`${team} Logo`}
                                                width={28}
                                                height={28}
                                                className="rounded-full"
                                            />
                                        </div>
                                    )}
                                    <span className={`text-sm font-medium transition-all duration-300 ${
                                        isSelected ? 'text-emerald-300' : 'text-zinc-400'
                                    }`}>
                                        {symbol}
                                    </span>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer with enhanced button */}
            <DialogFooter className="mt-8">
                {isLoggedIn ? (
                    <Button
                        disabled={!selectedTeam || !betAmount.trim()}
                        onClick={handleBet}
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-zinc-700 disabled:to-zinc-600 disabled:text-zinc-400 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                    >
                        {selectedTeam && betAmount.trim() ? (
                            <span className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Confirm ${betAmount} on {selectedTeam}
                            </span>
                        ) : (
                            'Select Team & Amount'
                        )}
                    </Button>
                ) : (
                    <Button 
                        onClick={onLogin} 
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Log in to Trade
                    </Button>
                )}
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}