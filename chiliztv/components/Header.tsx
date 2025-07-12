"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Trophy, TvIcon, User, X } from "lucide-react";

export function Header() {
    const router = useRouter();
    const { login } = useLogin();
    const { ready, authenticated } = usePrivy();

    const [menuOpen, setMenuOpen] = useState(false);

    if (!ready) return null;

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
                        <div className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/live")}>
                            <TvIcon /> 
                            <button className="text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/live")}>
                                Browse Matches
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/leaderboard")}>
                            <Trophy />
                            <button className="text-white/70 hover:text-white transition-colors cursor-pointer">
                                Leaderboard
                            </button>
                        </div>
                        {authenticated && (
                            <div className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/dashboard")}>
                                <User />
                                <button className="text-white/70 hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/dashboard")}>
                                    Profile
                                </button>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-white" onClick={() => setMenuOpen(prev => !prev)}>
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
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
                                    variant="ghost"
                                    className="hover:border-white text-white"
                                    onClick={() => login()}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : (
                                <Button
                                    variant="outline"
                                    className="border-white/20 bg-primary text-white"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Dashboard
                                </Button>
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
                            {authenticated && (
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
                                {authenticated ? (
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
                                                login();
                                                setMenuOpen(false);
                                            }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-white/20 hover:border-white bg-secondary hover:text-white"
                                            onClick={() => {
                                                login();
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
