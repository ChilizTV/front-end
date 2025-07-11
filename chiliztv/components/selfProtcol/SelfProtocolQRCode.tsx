"use client";

import React, { useState } from 'react';
import { SelfQRcodeWrapper, SelfAppBuilder } from '@selfxyz/qrcode';
import { useWallets } from '@privy-io/react-auth';


export default function SelfProtocolQRCode() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { wallets } = useWallets();

    const userId = wallets.length > 0 ? wallets[0].address : undefined;

    const handleSuccessfulVerification = () => {
        // Handle successful verification logic here
        console.log("Identity verified successfully");
    };

    const selfApp = new SelfAppBuilder({
        appName: "ChilizTV",
        scope: "chiliztv",
        endpoint: "https://chiliztv.vercel.app/api/verifier",
        endpointType: "staging_https",
        userId,
        userIdType: "hex",
        disclosures: {                    // NEW: Must match backend config
            minimumAge: 18,
            excludedCountries: ['IRN', 'PRK'],
            ofac: true,
            name: true,
            nationality: true,
        },
        devMode: true, // Set to true for development, false for production
        userDefinedData: JSON.stringify({
            walletAddress: userId as string, // Ensure userId is a string
        })
    }).build();


    return (
        <div>
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg p-6 max-w-md w-full relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                            onClick={() => setIsDialogOpen(false)}
                            aria-label="Close dialog"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-4">Verify Your Identity</h2>

                        {selfApp ? (
                            <SelfQRcodeWrapper
                                selfApp={selfApp}
                                onSuccess={() => {
                                    handleSuccessfulVerification();
                                    setIsDialogOpen(false);
                                }}
                                onError={() => {
                                    console.error("Error: Failed to verify identity");
                                }}
                            />
                        ) : (
                            <div className="w-[256px] h-[256px] bg-gray-200 animate-pulse flex items-center justify-center">
                                <p className="text-gray-500 text-sm">Loading QR Code...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )

}