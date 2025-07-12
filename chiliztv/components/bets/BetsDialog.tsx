"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { TrendingUp } from "lucide-react";
import { getCHZPricePyth } from "@/app/actions/getCHZPricePyth";

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
    const [chzPrice, setChzPrice] = useState<number | null>(null);
    const maxAmount = 22; // Example max amount, can be dynamic

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

    const fetchCHZPrice = async () => {
        try {
        const result = await getCHZPricePyth();
        const parsed = result?.parsed?.[0]?.price;
        if (parsed?.price && parsed?.expo) {
            const priceInUsd = Number(parsed.price) * Math.pow(10, parsed.expo);
            console.log("CHZ Price in USD:", priceInUsd);
            setChzPrice(priceInUsd);
        }
        } catch (err) {
        console.error("Error fetching CHZ price:", err);
        }
    };

    useEffect(() => {
        fetchCHZPrice();
        const interval = setInterval(fetchCHZPrice, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-foreground)] text-[var(--primary-foreground)] font-semibold shadow-md rounded-lg transition-transform duration-200 transform hover:scale-[1.05] flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
                Place Bet
            </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-lg p-8 text-[var(--foreground)]">
            <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-center mb-8">
                Place Your Bet
            </DialogTitle>
            </DialogHeader>

            {/* Amount Input */}
            <div className="relative w-full">
            <div className="relative w-full">
                <div className="flex items-center justify-center w-full gap-4">
                    <span className="text-6xl font-bold text-muted-foreground select-none">
                    $
                    </span>
                    <input
                    id="betAmount"
                    type="number"
                    inputMode="decimal"
                    min="1"
                    placeholder="0.00"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    autoFocus
                    className="
                        w-auto
                        max-w-[200px]
                        text-7xl
                        font-extrabold
                        bg-transparent
                        text-[var(--foreground)]
                        placeholder-[var(--muted-foreground)]
                        text-center
                        outline-none
                        border-none
                        ring-0
                        shadow-none
                        py-6
                        transition-transform duration-300 ease-in-out
                        focus:scale-[1.02]
                        tracking-tight
                        selection:bg-[var(--accent)]
                        [appearance:textfield]
                        [&::-webkit-inner-spin-button]:appearance-none
                        [&::-webkit-outer-spin-button]:appearance-none
                    "
                    />

                    {/* Max Button */}
                    <button
                    onClick={() => setBetAmount(maxAmount.toString())}
                    className="ml-2 px-3 py-1.5 text-sm font-medium text-[var(--accent-foreground)] bg-[var(--muted)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted-foreground)/10] transition"
                    >
                    Max
                    </button>
                </div>

                {chzPrice && betAmount && !isNaN(Number(betAmount)) && (
                    <div className="mt-3 text-center text-sm text-[var(--muted-foreground)] flex items-center justify-center gap-2">
                    <Image src="/chiliz_icon.png" alt="CHZ Icon" width={18} height={18} />
                    ≈ {(Number(betAmount) / chzPrice).toFixed(2)} CHZ
                    </div>
                )}
                </div>
            </div>

            {/* Team Selection + Draw */}
            <div className="mt-8">
            <p className="text-center text-sm font-semibold text-[var(--muted-foreground)] mb-5">
                Select Winning Team or Draw
            </p>
            <div className="grid grid-cols-3 gap-4">
                {[TeamA, "Draw", TeamB].map((team) => {
                const data = getTeamData(team);
                const symbol = team === "Draw" ? "Draw" : data?.symbol ?? team;
                const image = team === "Draw" ? null : data?.image ?? "";
                const isSelected = selectedTeam === symbol;

                return (
                    <button
                    key={team}
                    onClick={() => setSelectedTeam(symbol)}
                    className={`flex flex-col items-center justify-center gap-3 py-5 rounded-xl border transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                        ${
                        isSelected
                            ? "bg-[var(--accent)] border-[var(--accent-foreground)] text-[var(--accent-foreground)] shadow-md"
                            : "bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted-foreground)/10] hover:border-[var(--accent)]"
                        }`}
                    aria-pressed={isSelected}
                    >
                    {image ? (
                        <div
                        className={`p-2 rounded-full transition-colors duration-200 ${
                            isSelected
                            ? "bg-[var(--accent-foreground)]"
                            : "bg-[var(--muted-foreground)]"
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
                    ) : (
                        <div
                        className={`text-sm font-bold px-4 py-2 rounded-full ${
                            isSelected
                            ? "bg-[var(--accent-foreground)] text-[var(--background)]"
                            : "bg-[var(--muted-foreground)] text-[var(--foreground)]"
                        }`}
                        >
                        DRAW
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
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-[var(--accent-foreground)] disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)] rounded-xl transition-colors duration-200"
                >
                {selectedTeam && betAmount.trim() ? (
                    <span className="flex items-center justify-center gap-2">
                    Confirm ${betAmount} on {selectedTeam}
                    </span>
                ) : (
                    "Select Team & Amount"
                )}
                </Button>
            ) : (
                <Button
                onClick={onLogin}
                className="w-full h-14 text-lg font-semibold bg-[var(--primary)] hover:bg-[var(--primary-foreground)] rounded-xl transition-colors duration-200"
                >
                Log in to Trade
                </Button>
            )}
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
