import React from "react";
import { SelfQRcodeWrapper, SelfAppBuilder } from "@selfxyz/qrcode";
import { useWallets } from "@privy-io/react-auth";

interface SelfProtocolQRCodeProps {
    onClose?: () => void;
}

export default function SelfProtocolQRCode({ onClose }: SelfProtocolQRCodeProps) {
    const { wallets } = useWallets();
    const userId = wallets.length > 0 ? wallets[0].address : undefined;

    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleSuccessfulVerification = () => {
        console.log("Identity verified successfully");
        handleClose();
    };

    const selfApp = new SelfAppBuilder({
        appName: "ChilizTV",
        scope: "chiliztv",
        logoBase64: "https://chiliztv.vercel.app/chiliz_icon.png",
        endpoint: "https://chiliztv.vercel.app/api/verifier",
        endpointType: "staging_https",
        userId,
        userIdType: "hex",
        disclosures: {
        minimumAge: 18,
        excludedCountries: ["IRN", "PRK"],
        ofac: true,
        name: true,
        nationality: true,
        },
        devMode: true,
        userDefinedData: JSON.stringify({
        walletAddress: userId as string,
        }),
    }).build();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-md w-full relative">
            <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            onClick={handleClose}
            aria-label="Close dialog"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Verify Your Identity
            </h2>

            {selfApp ? (
            <SelfQRcodeWrapper
                selfApp={selfApp}
                onSuccess={handleSuccessfulVerification}
                onError={() => {
                console.error("Error: Failed to verify identity");
                }}
            />
            ) : (
            <div className="w-[280px] h-[280px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center mx-auto">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading QR Code...</p>
            </div>
            )}

            <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            Scan the QR code with the Self Protocol app to verify your identity securely.
            </p>
        </div>
        </div>
    );
}
