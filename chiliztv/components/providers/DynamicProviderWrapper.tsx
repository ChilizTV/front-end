"use client";

import {
    DynamicContextProvider,
    SortWallets,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import * as React from "react";
import { useRouter } from "next/navigation";
import { WagmiProviderWrapper } from "./WagmiProviderWrapper";

export const sidebarCss = `
    @media (min-width: 768px) {
    .accordion-item {
        max-height: 100vh !important;
    }

    .modal,
    .dynamic-widget-modal,
    .dynamic-widget-card {
        right: 0 !important;
        top: 0 !important;
        transform: none !important;
        height: 100vh !important;
        border-radius: 0 !important;
        left: auto !important;
        background-color: rgb(121, 37, 41) !important; /* Deep red background */
        color: #ffffff !important;
    }

    .wallet-list__scroll-container,
    .settings-view__body,
    .modal-card,
    .dynamic-widget-card,
    .social-redirect-view__container,
    .wallet-no-access__container,
    .pending-signature__container,
    .pending-connect__container,
    .footer-options-switcher__container,
    .dynamic-user-profile-layout,
    .dynamic-footer,
    .tos-and-pp__footer {
        background-color:transparent !important; /* Solid black */
        color: transparent !important;
    }

    .modal-card,
    .dynamic-widget-card {
        background: linear-gradient(to bottom, rgb(121, 37, 41), rgb(121, 37, 41)) !important;
    }

    .social-redirect-view__container,
    .wallet-no-access__container,
    .pending-signature__container,
    .pending-connect__container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin-top: -15%;
    }

    .footer-options-switcher__container {
        border-radius: 0 !important;
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
    }

    .dynamic-user-profile-layout {
        height: 90vh !important;
    }

    .dynamic-footer,
    .tos-and-pp__footer {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
    }

    .tos-and-pp__footer {
        bottom: 30px !important;
    }
    }
`;



export default function DynamicSolanaWalletProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();

    return (
        <WagmiProviderWrapper>
            <DynamicContextProvider
            settings={{
                environmentId: process.env.NEXT_PUBLIC_STAGING === "true" 
                    ? process.env.NEXT_PUBLIC_STAGING_DYNAMIC_ENVIRONMENT_ID ?? "" 
                    : process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? "",
                walletConnectors: [EthereumWalletConnectors],
                cssOverrides: sidebarCss,
                walletsFilter: SortWallets(['socios', 'metamask', 'coinbase', 'walletconnect', 'phantom']),
                events: {
                    onLogout: (args) => {
                        console.log("Logged out", args);
                        router.push("/");
                    },
                    onAuthSuccess: (args) => {
                        console.log("Auth success", args);
                        router.push("/live");
                    }
                }
            }}
            >
            {children}
            </DynamicContextProvider>
        </WagmiProviderWrapper>
    );
} 