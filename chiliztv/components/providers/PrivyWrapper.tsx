"use client";

import { PrivyProvider } from '@privy-io/react-auth';
import { spicy } from 'viem/chains';

export function PrivyWrapper({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider 
            appId={process.env.NEXT_PUBLIC_PRIVY_PROJECT_ID ?? ""}
            clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID ?? ""}
            config={{
                embeddedWallets: {
                ethereum: {
                    createOnLogin: 'users-without-wallets',
                },
                },
                supportedChains: [spicy],
            }}
            >
            {children}
        </PrivyProvider>
    );
}