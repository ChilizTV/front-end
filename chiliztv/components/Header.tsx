"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogin, useWallets, usePrivy } from '@privy-io/react-auth';

export function Header() {
    const router = useRouter();
    const { login } = useLogin();
    const { wallets } = useWallets();
    const { ready, authenticated, logout } = usePrivy();

    const walletAddress = wallets[0]?.address || "";
    const displayAddress = walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : "";

    if (!ready) return null; // Don't show header until Privy is ready

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <button className="flex items-center gap-4 cursor-pointer"
                        onClick={() => router.push("/")}
                    >
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

                    {/* Navigation */}
                    <nav className="hidden md:flex flex-row gap-[38px] items-center text-[16px]">
                        <button
                            className="text-white/70 hover:text-white transition-colors cursor-pointer"
                            onClick={() => router.push("/live")}
                        >
                            Live Matches
                        </button>
                        <button
                            className="text-white/70 hover:text-white transition-colors cursor-pointer"
                            onClick={() => router.push("/ranking")}
                        >
                            Ranking
                        </button>
                        {authenticated && (
                            <button
                                className="text-white/70 hover:text-white transition-colors cursor-pointer"
                                onClick={() => router.push("/dashboard")}
                            >
                                Dashboard
                            </button>
                        )}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {/* Show wallet address if authenticated */}
                        {authenticated && (
                            <span className="text-white/80 text-sm hidden md:inline">
                                {displayAddress}
                            </span>
                        )}

                        {!authenticated ? (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-white/20 hover:border-white hover:text-white bg-primary text-white"
                                    onClick={() => login()}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white/20 hover:border-white hover:text-white"
                                    onClick={() => login()}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    className="border-white/20 hover:border-white hover:text-white"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white/20 hover:border-white hover:text-white"
                                    onClick={() => logout()}
                                >
                                    Disconnect
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
