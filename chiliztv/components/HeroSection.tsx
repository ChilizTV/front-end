"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import SplineBackground from "./SplineBackground";
import { useLogin, usePrivy } from '@privy-io/react-auth';


export function HeroSection() {
    const { login } = useLogin();
    const { authenticated } = usePrivy();

    return (
        <section className="relative h-screen flex items-center justify-center w-full overflow-hidden bg-black">
        {/* Animated 3D-style Background */}
        <SplineBackground />
        
        <div className="absolute inset-0 z-0">
            {/* Stadium-inspired animated background */}
            <div className="absolute inset-0">
            {/* Base gradient */}
            <div 
                className="absolute inset-0 bg-black/20"
            />
        
            
            {/* Floating particles */}
            <div className="absolute inset-0">
                <div className="absolute top-[30%] left-[25%] w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                <div className="absolute top-[70%] right-[25%] w-1 h-1 bg-[#FF3465]/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                <div className="absolute top-[50%] left-[70%] w-1 h-1 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
                <div className="absolute bottom-[40%] left-[50%] w-1 h-1 bg-[#FF3465]/50 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
            </div>
            </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 z-10 overflow-hidden">
            {/* Glowing orbs */}
            <div className="absolute left-[-200px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute right-[-150px] bottom-0 w-[300px] h-[300px] bg-[#FF3465]/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-20 w-full h-full flex flex-col justify-center items-center px-8 pt-20">
            {/* Main Content - Centered */}
            <div className="max-w-5xl mx-auto text-center flex-1 flex flex-col justify-center">
            <div className="mb-8">
                <h1 className="text-[64px] md:text-[80px] lg:text-[96px] font-black text-white leading-[0.9] mb-6 drop-shadow-2xl" style={{ fontFamily: 'Lexend, sans-serif' }}>
                    Live Football.
                <br />
                <span className="text-primary drop-shadow-2xl">Live ChilizTV.</span>
                </h1>
                <p className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-white mb-6 drop-shadow-lg" style={{ fontFamily: 'Lexend, sans-serif' }}>
                    The Ultimate SocialFi Experience for Football Fans.
                </p>
                <p className="text-[16px] md:text-[18px] text-white/95 leading-relaxed max-w-2xl mx-auto drop-shadow-md break-words" style={{ fontFamily: 'Lexend, sans-serif' }}>
                    Join thousands of fans predict on live football matches.<br />
                    And earn Fan Tokens to unlock exclusive rewards and experiences.
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 px-8 py-4 text-[16px] font-bold tracking-wide uppercase rounded-full shadow-2xl border-primary/20 border transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Lexend, sans-serif' }}
                onClick={() => {
                    if (authenticated) {
                        window.location.href = "/live";
                    } else {
                        login();
                    }
                }} // Redirect to dashboard if authenticated, otherwise trigger login
                >
                    Start Playing Now
                <Play className="ml-2 h-5 w-5 rotate-90" />
                </Button>
            </div>
            </div>
        </div>
        </section>
    );
}