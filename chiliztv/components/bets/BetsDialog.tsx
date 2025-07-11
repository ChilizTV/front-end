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
            <Button
            className="
                w-full
                bg-[var(--primary)]
                hover:bg-[var(--primary-foreground)]
                text-[var(--primary-foreground)]
                font-semibold
                shadow-md
                rounded-lg
                transition-transform duration-200 transform hover:scale-[1.05]
                flex items-center justify-center gap-2
            "
            >
            <TrendingUp className="w-5 h-5" />
            Place Bet
            </Button>
        </DialogTrigger>

        <DialogContent
            className="
            max-w-md
            bg-[var(--background)]
            rounded-xl
            border
            border-[var(--border)]
            shadow-lg
            p-8
            text-[var(--foreground)]
            "
        >
            <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-center mb-8">
                Place Your Bet
            </DialogTitle>
            </DialogHeader>

            {/* Amount Input */}
            <div className="mb-10">
            <label
                htmlFor="betAmount"
                className="block text-sm font-semibold text-[var(--muted-foreground)] mb-3"
            >
                Bet Amount (USD)
            </label>
            <Input
                id="betAmount"
                type="number"
                min="1"
                placeholder="0.00"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="
                w-full
                text-center
                text-6xl
                font-extrabold
                bg-[var(--muted)]
                border
                border-[var(--border)]
                rounded-xl
                py-6
                focus:ring-2
                focus:ring-[var(--accent)]
                placeholder-[var(--muted-foreground)]
                transition duration-200
                "
            />
            </div>

            {/* Team Selection */}
            <div>
            <p className="text-center text-sm font-semibold text-[var(--muted-foreground)] mb-5">
                Select Winning Team
            </p>
            <div className="grid grid-cols-2 gap-6">
                {[TeamA, TeamB].map((team) => {
                const data = getTeamData(team);
                const symbol = data?.symbol || team;
                const image = data?.image || "";
                const isSelected = selectedTeam === symbol;

                return (
                    <button
                    key={team}
                    onClick={() => setSelectedTeam(symbol)}
                    className={`
                        flex flex-col items-center justify-center gap-3 py-5 rounded-xl border transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                        ${
                        isSelected
                            ? "bg-[var(--accent)] border-[var(--accent-foreground)] text-[var(--accent-foreground)] shadow-md"
                            : "bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted-foreground)/10] hover:border-[var(--accent)]"
                        }
                    `}
                    aria-pressed={isSelected}
                    >
                    {image && (
                        <div
                        className={`p-2 rounded-full transition-colors duration-200 ${
                            isSelected ? "bg-[var(--accent-foreground)]" : "bg-[var(--muted-foreground)]"
                        }`}
                        >
                        <Image
                            src={image}
                            alt={`${team} Logo`}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        </div>
                    )}
                    <span className="text-lg font-semibold tracking-wide">{symbol}</span>
                    </button>
                );
                })}
            </div>
            </div>

            {/* Footer */}
            <DialogFooter className="mt-10">
            {isLoggedIn ? (
                <Button
                disabled={!selectedTeam || !betAmount.trim()}
                onClick={handleBet}
                className="
                    w-full h-14 text-lg font-semibold
                    bg-[var(--accent)]
                    hover:bg-[var(--accent-foreground)]
                    disabled:bg-[var(--muted)]
                    disabled:text-[var(--muted-foreground)]
                    rounded-xl
                    transition-colors duration-200
                "
                >
                {selectedTeam && betAmount.trim() ? (
                    <span className="flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Confirm ${betAmount} on {selectedTeam}
                    </span>
                ) : (
                    "Select Team & Amount"
                )}
                </Button>
            ) : (
                <Button
                onClick={onLogin}
                className="
                    w-full h-14 text-lg font-semibold
                    bg-[var(--primary)]
                    hover:bg-[var(--primary-foreground)]
                    rounded-xl
                    transition-colors duration-200
                "
                >
                Log in to Trade
                </Button>
            )}
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
