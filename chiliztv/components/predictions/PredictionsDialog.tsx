/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { CONTRACTS_ADDRESSES } from "@/utils/ContractsAddresses";
import { parseEther } from "viem";
import { BETTING_ABI } from "@/lib/abis/bettingAbi";
import { useWallets } from "@privy-io/react-auth";
import { ChatService } from "@/services/chat.service";
import Confetti from "react-confetti";

interface PredictionsDialogProps {
    isLoggedIn: boolean;
    onLogin: () => void;
    onpredictionPlaced?: (outcome: string, amount: string) => void;
    TeamA: string;
    TeamB: string;
    matchId?: string;
    userId?: string;
    username?: string;
    walletAddress?: string;
}

export default function PredictionsDialog({
    isLoggedIn,
    onLogin,
    onpredictionPlaced,
    TeamA,
    TeamB,
    matchId,
    userId,
    username,
    walletAddress,
}: PredictionsDialogProps) {
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [predictionAmount, setpredictionAmount] = useState("");
    const [chzPrice, setChzPrice] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [fanTokenBalance, setFanTokenBalance] = useState<number>(0);
    const [tokenBreakdown, setTokenBreakdown] = useState<{ [key: string]: number }>({});
    const [showConfetti, setShowConfetti] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
    const { wallets } = useWallets();

    const user = wallets?.[0]?.address ?? "";

    const { data: balanceData } = useBalance({
        address: user as `0x{string}`,
    });

    console.log("User balance :", balanceData?.formatted);

    // Get window dimensions for confetti
    useEffect(() => {
        const getWindowDimensions = () => ({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        setWindowDimensions(getWindowDimensions());

        const handleResize = () => {
            setWindowDimensions(getWindowDimensions());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchUserFanTokens = async () => {
            if (walletAddress && walletAddress !== "" && isDialogOpen) {
                try {
                    const result = await ChatService.getUserTokenBalances(walletAddress);
                    if (result.errorCode === 0 && result.result) {
                        // Handle the new UserTokenBalance structure
                        const userBalance = result.result as {
                            walletAddress: string;
                            totalBalance: number;
                            tokenBalances: Array<{
                                token: { symbol: string };
                                balance: number;
                            }>;
                            isFeatured: boolean;
                        };
                        
                        const totalTokens = userBalance.totalBalance;
                        const balances: { [key: string]: number } = {};
                        
                        userBalance.tokenBalances.forEach(tokenBalance => {
                            balances[tokenBalance.token.symbol] = tokenBalance.balance;
                        });
                        
                        setFanTokenBalance(totalTokens);
                        setTokenBreakdown(balances);
                        console.log("💰 Total fan tokens for user:", totalTokens);
                        console.log("📊 User token breakdown:", Object.entries(balances).map(([symbol, balance]) => `${symbol}: ${balance}`));
                    } else {
                        console.log("❌ Failed to fetch user fan tokens");
                        setFanTokenBalance(0);
                        setTokenBreakdown({});
                    }
                } catch (error) {
                    console.error("❌ Error fetching user fan tokens:", error);
                    setFanTokenBalance(0);
                    setTokenBreakdown({});
                }
            }
        };

        fetchUserFanTokens();
    }, [walletAddress, isDialogOpen]);

    const maxAmount = balanceData ? 
        (Number(balanceData.formatted) * chzPrice!) : 0;

    const {
        writeContract,
        data: hash,
        error,
        isPending
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    // Helper function to convert team selection to contract outcome format
    const getOutcomeIndex = (teamSymbol: string): bigint => {
        const teamAData = getTeamData(TeamA);
        const teamBData = getTeamData(TeamB);
        const teamASymbol = teamAData?.symbol ?? TeamA;
        const teamBSymbol = teamBData?.symbol ?? TeamB;
        
        // Handle half-time predictions
        if (teamSymbol.includes(" HT")) {
            const baseSymbol = teamSymbol.replace(" HT", "");
            if (baseSymbol === teamASymbol) {
                return BigInt(4); // Home HT win
            } else if (baseSymbol === "Draw") {
                return BigInt(5); // Draw HT
            } else if (baseSymbol === teamBSymbol) {
                return BigInt(6); // Away HT win
            }
        }
        
        // Handle full-time predictions
        if (teamSymbol === teamASymbol) {
            return BigInt(1); // Home win
        } else if (teamSymbol === "Draw") {
            return BigInt(2); // Draw
        } else if (teamSymbol === teamBSymbol) {
            return BigInt(3); // Away win
        }
        
        throw new Error(`Unknown team symbol: ${teamSymbol}`);
    };

    const handleprediction = async () => {
        if (!isLoggedIn) {
            console.error("User is not logged in");
            onLogin();
            return;
        }
    
        if (!selectedTeam || !predictionAmount.trim()) {
            console.error("Please select a team and enter a prediction amount");
            return;
        }
    
        if (!chzPrice) {
            console.error("CHZ price not loaded");
            return;
        }

        // Convert USD amount to CHZ amount
        const chzAmount = Number(predictionAmount) / chzPrice;
        
        // Parse the CHZ amount to wei (18 decimals)
        const parsedAmount = parseEther(chzAmount.toString());
        
        if (parsedAmount <= 0) {
            console.error("Invalid pred amount");
            return;
        }
    
        try {
            const outcomeIndex = getOutcomeIndex(selectedTeam);
    
            console.log("Placing prediction with:", {
                outcomeIndex: outcomeIndex.toString(),
                amountInUSD: predictionAmount,
                amountInCHZ: chzAmount.toString(),
                amountInWei: parsedAmount.toString(),
                contractAddress: CONTRACTS_ADDRESSES.betting,
                selectedTeam
            });

            writeContract({
                address: CONTRACTS_ADDRESSES.betting,
                abi: BETTING_ABI,
                functionName: "placeBet",
                args: [Number(outcomeIndex)], // Convert outcomeIndex to number
                value: parsedAmount, // Send the CHZ amount as value
            });
        } catch (err) {
            console.error("Error placing prediction:", err);
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            
            // Show confetti and confirmation dialog
            setShowConfetti(true);
            setShowConfirmationDialog(true);
            
            // Stop confetti after 3 seconds
            setTimeout(() => {
                setShowConfetti(false);
            }, 3000);
            
            if (matchId && userId && username && walletAddress && selectedTeam) {
                const sendpredictionToChat = async () => {
                    try {
                        let predictionType = "match_winner";
                        let predictionSubType = "";
                        
                        // Handle half-time predictions
                        if (selectedTeam.includes(" HT")) {
                            predictionType = "first_half_winner";
                            const baseSymbol = selectedTeam.replace(" HT", "");
                            if (baseSymbol === TeamA) {
                                predictionSubType = "home";
                            } else if (baseSymbol === "Draw") {
                                predictionSubType = "draw";
                            } else if (baseSymbol === TeamB) {
                                predictionSubType = "away";
                            }
                        } else {
                            // Handle full-time predictions
                            if (selectedTeam === TeamA) {
                                predictionSubType = "home";
                            } else if (selectedTeam === "Draw") {
                                predictionSubType = "draw";
                            } else if (selectedTeam === TeamB) {
                                predictionSubType = "away";
                            }
                        }
                        
                        const odds = 2.5;
                        
                        const result = await ChatService.sendBetMessage(
                            parseInt(matchId),
                            userId,
                            username,
                            predictionType,
                            predictionSubType,
                            parseFloat(predictionAmount),
                            odds,
                            walletAddress
                        );
                        
                        if (result.errorCode === 0) {
                            console.log("✅ prediction sent to chat backend successfully");
                        } else {
                            console.error("❌ Failed to send prediction to chat backend");
                        }
                    } catch (error) {
                        console.error("❌ Error sending prediction to chat backend:", error);
                    }
                };
                
                sendpredictionToChat();
            }
            
            onpredictionPlaced?.(selectedTeam!, predictionAmount);
        }
    }, [isConfirmed, selectedTeam, predictionAmount, onpredictionPlaced, matchId, userId, username, walletAddress, TeamA, TeamB]);

    useEffect(() => {
        if (error) {
            console.error("Transaction error:", error);
        }
    }, [error]);

    const getTeamData = (team: string) =>
        FAN_TOKENS.find((token) => token[team])?.[team];

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setSelectedTeam(null);
            setpredictionAmount("");
            setShowConfirmationDialog(false);
            setShowConfetti(false);
        }
    };

    const handleConfirmationClose = () => {
        setShowConfirmationDialog(false);
        setShowConfetti(false);
        setIsDialogOpen(false);
        setSelectedTeam(null);
        setpredictionAmount("");
    };

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
        <>
            {/* Confetti Component */}
            {showConfetti && (
                <Confetti
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    recycle={false}
                    numberOfPieces={200}
                    colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
                />
            )}

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
                <DialogContent className="max-w-md bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-lg p-8 text-[var(--foreground)]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center text-green-500 mb-4">
                            🎉 Prediction Confirmed!
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="text-center space-y-4">
                        <div className="text-lg">
                            Your prediction of <span className="font-bold text-green-400">${predictionAmount}</span> on{' '}
                            <span className="font-bold text-blue-400">{selectedTeam}</span> has been placed successfully!
                        </div>
                        
                        <div className="text-sm text-[var(--muted-foreground)]">
                            Transaction hash: {hash?.slice(0, 10)}...{hash?.slice(-8)}
                        </div>
                        
                        <div className="pt-4">
                            <div className="text-sm text-[var(--muted-foreground)] mb-2">
                                Good luck! 🍀
                            </div>
                        </div>
                    </div>
                    
                    <DialogFooter className="mt-6">
                        <Button 
                            onClick={handleConfirmationClose}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                        >
                            Awesome! 🚀
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Main prediction Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                    <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-foreground)] text-[var(--primary-foreground)] font-semibold shadow-md rounded-lg transition-transform duration-200 transform hover:scale-[1.05] flex items-center justify-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Place prediction
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-lg p-8 text-[var(--foreground)] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-extrabold text-center mb-8">
                            Place Your Prediction
                        </DialogTitle>
                        
                        {/* Fan Token Balance Display */}
                        {isLoggedIn && fanTokenBalance > 0 && (
                            <div className="mb-6 p-3 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg">
                                <div className="text-center">
                                    <div className="text-sm font-semibold text-yellow-400 mb-1">
                                        🏆 Your Fan Tokens
                                    </div>
                                    <div className="text-lg font-bold text-yellow-300 mb-2">
                                        {fanTokenBalance.toLocaleString()} tokens
                                    </div>
                                    {Object.keys(tokenBreakdown).length > 0 && (
                                        <div className="text-xs text-yellow-200/80">
                                            {Object.entries(tokenBreakdown)
                                                .filter(([_, balance]) => balance > 0)
                                                .map(([symbol, balance]) => (
                                                    <span key={symbol} className="inline-block mr-2 mb-1">
                                                        {symbol}: {balance.toLocaleString()}
                                                    </span>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogHeader>

                    {/* Amount Input */}
                    <div className="relative w-full">
                        <div className="relative w-full">
                            <div className="flex items-center justify-center w-full gap-4">
                                <span className="text-6xl font-bold text-muted-foreground select-none">
                                    $
                                </span>
                                <input
                                    id="predictionAmount"
                                    type="number"
                                    inputMode="decimal"
                                    min="1"
                                    placeholder="0.00"
                                    value={predictionAmount}
                                    onChange={(e) => setpredictionAmount(e.target.value)}
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
                                    onClick={() => setpredictionAmount(maxAmount.toString())}
                                    className="ml-2 px-3 py-1.5 text-sm font-medium text-[var(--accent-foreground)] bg-[var(--muted)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted-foreground)/10] transition"
                                >
                                    Max
                                </button>
                            </div>

                            {chzPrice && predictionAmount && !isNaN(Number(predictionAmount)) && (
                                <div className="mt-3 text-center text-sm text-[var(--muted-foreground)] flex items-center justify-center gap-2">
                                    <Image src="/chiliz_icon.png" alt="CHZ Icon" width={18} height={18} />
                                    ≈ {(Number(predictionAmount) / chzPrice).toFixed(2)} CHZ
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

                    {/* Half-Time predictionting Section */}
                    <div className="mt-8 pt-6 border-t border-[var(--border)]">
                        <p className="text-center text-sm font-semibold text-[var(--muted-foreground)] mb-5">
                            🕐 Half-Time Result
                        </p>
                        
                        {/* Fan Token Requirement Message */}
                        {isLoggedIn && fanTokenBalance < 50 && (
                            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                <div className="text-center">
                                    <div className="text-sm font-semibold text-amber-400 mb-1">
                                        🔒 Half-Time Prediction Locked
                                    </div>
                                    <div className="text-xs text-amber-300/80">
                                        You need at least 50 fan tokens to access half-time prediction.
                                        <br />
                                        Your current balance: <span className="font-bold">{fanTokenBalance.toLocaleString()}</span> fan tokens
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-3 gap-4">
                            {[`${TeamA} HT`, "Draw HT", `${TeamB} HT`].map((team) => {
                                const data = getTeamData(team.replace(" HT", ""));
                                const symbol = team === "Draw HT" ? "Draw HT" : data?.symbol ? `${data.symbol} HT` : team;
                                const image = team === "Draw HT" ? null : data?.image ?? "";
                                const isSelected = selectedTeam === symbol;
                                const isDisabled = isLoggedIn && fanTokenBalance < 50;

                                return (
                                    <button
                                        key={team}
                                        onClick={() => !isDisabled && setSelectedTeam(symbol)}
                                        disabled={isDisabled}
                                        className={`flex flex-col items-center justify-center gap-3 py-4 rounded-xl border transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                                            ${
                                                isSelected
                                                    ? "bg-[var(--accent)] border-[var(--accent-foreground)] text-[var(--accent-foreground)] shadow-md"
                                                    : isDisabled
                                                    ? "bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)] opacity-50 cursor-not-allowed"
                                                    : "bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted-foreground)/10] hover:border-[var(--accent)]"
                                            }`}
                                        aria-pressed={isSelected}
                                    >
                                        {image ? (
                                            <div
                                                className={`p-2 rounded-full transition-colors duration-200 ${
                                                    isSelected
                                                        ? "bg-[var(--accent-foreground)]"
                                                        : isDisabled
                                                        ? "bg-[var(--muted-foreground)] opacity-50"
                                                        : "bg-[var(--muted-foreground)]"
                                                }`}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${team} Logo`}
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                    isSelected
                                                        ? "bg-[var(--accent-foreground)] text-[var(--background)]"
                                                        : isDisabled
                                                        ? "bg-[var(--muted-foreground)] text-[var(--foreground)] opacity-50"
                                                        : "bg-[var(--muted-foreground)] text-[var(--foreground)]"
                                                }`}
                                            >
                                                DRAW
                                            </div>
                                        )}
                                        <span className={`text-sm font-semibold tracking-wide text-center ${
                                            isDisabled ? "opacity-50" : ""
                                        }`}>{symbol}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <p className="text-sm">Error: {error.message}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <DialogFooter className="mt-10">
                        {isLoggedIn ? (
                            <Button
                                disabled={!selectedTeam || !predictionAmount.trim() || isPending || isConfirming || !chzPrice}
                                onClick={handleprediction}
                                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-[var(--accent-foreground)] disabled:bg-[var(--muted)] disabled:text-[var(--muted-foreground)] rounded-xl transition-colors duration-200"
                            >
                                {isPending ? (
                                    "Confirming..."
                                ) : isConfirming ? (
                                    "Processing..."
                                ) : selectedTeam && predictionAmount.trim() ? (
                                    <span className="flex items-center justify-center gap-2">
                                        Confirm ${predictionAmount} on {selectedTeam}
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
        </>
    );
}