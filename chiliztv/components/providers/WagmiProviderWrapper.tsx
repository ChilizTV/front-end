// components/providers/WagmiProviderWrapper.tsx
"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { spicy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [spicy],
  transports: {
    [spicy.id]: http(),
  },
});

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
        </WagmiProvider>
    );
}
