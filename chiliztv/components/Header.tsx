"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Trophy, TvIcon, User, X } from "lucide-react";
import { getCHZPricePyth } from "@/app/actions/getCHZPricePyth";
import { useBalance } from "wagmi";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export function Header() {
    const router = useRouter();
    const { setShowAuthFlow, primaryWallet } = useDynamicContext();
    const [chzPrice, setChzPrice] = useState<number>(0);

    const connected = Boolean(primaryWallet?.address);

    const address = primaryWallet?.address || "";

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

    // Fetch CHZ price on component mount
    useEffect(() => {
        fetchCHZPrice();
    }
    , []);

    const { data: balanceData } = useBalance({
        address: address as `0x{string}`,
    });

    const [menuOpen, setMenuOpen] = useState(false);

    if (!primaryWallet) {
        return null; // or a loading state
    }

    const dropdownVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
    };

    return (
        <header className="sticky top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 bg-gradient-to-b from-black/20 to-transparent shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <button className="flex items-center gap-4 cursor-pointer" onClick={() => router.push("/")}>
                        <Image
                            src="/chiliz_icon.png"
                            alt="ChilizTV Logo"
                            width={40}
                            height={40}
                            className="rounded-full shadow-lg transition-transform hover:scale-105"
                        />
                        <div className="text-white text-[24px] uppercase tracking-wider">
                            ChilizTV
                        </div>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex flex-row gap-[38px] items-center text-[16px]">
                        <button
                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                            onClick={() => router.push("/live")}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    router.push("/live");
                                }
                            }}
                        >
                            <TvIcon /> 
                            <button className="text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/live")}>
                                Browse Matches
                            </button>
                        </button>
                        <button
                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                            onClick={() => router.push("/leaderboard")}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    router.push("/leaderboard");
                                }
                            }}
                        >
                            <Trophy />
                            <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
                                Leaderboard
                            </button>
                        </button>
                        {connected && (
                            // Balance in USD
                            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/dashboard")}>
                                <User />
                                <button className="text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/dashboard")}>
                                    Profile
                                </button>
                            </button>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-white" onClick={() => setMenuOpen(prev => !prev)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        {!connected ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-white/20 hover:border-white hover:text-white bg-primary text-white"
                                    onClick={() => setShowAuthFlow(true)}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="hover:border-white text-white"
                                    onClick={() => setShowAuthFlow(true)}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            // Dashboard Button
                            <>
                                <div className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/dashboard")}>
                                    <span className="text-white/70 hover:text-white transition-colors cursor-pointer border border-white/20 px-2 py-1 rounded-lg">
                                        {/* Display Wallet Address */}
                                        {/* Wallet Balance in USD */}
                                        {balanceData ? `$${(Number(balanceData.value) / 1e18 * chzPrice).toFixed(2)}` : "Loading..."}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="border-white/20 bg-primary text-white"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Dashboard
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Drop-down Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={dropdownVariants}
                            transition={{ duration: 0.25 }}
                            className="md:hidden overflow-hidden flex flex-col gap-4 mt-4 text-white text-base"
                        >
                            <button
                                onClick={() => {
                                    router.push("/live");
                                    setMenuOpen(false);
                                }}
                                className="text-white/80 hover:text-white text-left"
                            >
                                Live Matches
                            </button>
                            <button
                                onClick={() => {
                                    router.push("/leaderboard");
                                    setMenuOpen(false);
                                }}
                                className="text-white/80 hover:text-white text-left"
                            >
                                Leaderboard
                            </button>
                            {connected && (
                                <button
                                    onClick={() => {
                                        router.push("/dashboard");
                                        setMenuOpen(false);
                                    }}
                                    className="text-white/80 hover:text-white text-left"
                                >
                                    Dashboard
                                </button>
                            )}
                            <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                                {connected ? (
                                        <Button
                                            variant="outline"
                                            className="border-white/20 bg-primary text-white"
                                            onClick={() => {
                                                router.push("/dashboard");
                                                setMenuOpen(false);
                                            }}
                                        >
                                            Dashboard
                                        </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="border-white/20 hover:border-white hover:text-white bg-primary text-white"
                                            onClick={() => {
                                                setShowAuthFlow(true);
                                                setMenuOpen(false);
                                            }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-white/20 hover:border-white bg-secondary hover:text-white"
                                            onClick={() => {
                                                setShowAuthFlow(true);
                                                setMenuOpen(false);
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
