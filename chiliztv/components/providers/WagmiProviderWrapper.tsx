// components/providers/WagmiProviderWrapper.tsx
"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { chiliz, spicy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [spicy, chiliz],
  transports: {
    [spicy.id]: http(),
    [chiliz.id]: http(),
  },
});

export function WagmiProviderWrapper({ children }: { readonly children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
              {children}
          </QueryClientProvider>
        </WagmiProvider>
    );
}
