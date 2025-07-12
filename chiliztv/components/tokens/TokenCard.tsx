// TokenCard.tsx
import React from "react";
import { TokenWithBalance } from "@/utils/FanTokens";
import Image from "next/image";

export default function TokenCard({ token }: Readonly<{ token: TokenWithBalance }>) {
    const { team, logo, symbol, quantity, currentPrice, change } = {
        team: token.name,
        logo: token.image,
        symbol: token.symbol,
        quantity: token.quantity,
        currentPrice: token.currentPrice,
        change: token.change,
    };

    return (
        <div className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-4">
            <Image
            src={logo}
            alt={team}
            className="h-12 w-12 rounded-full object-cover"
            />
            <div>
            <div className="text-xl font-semibold">{team}</div>
            <div className="text-sm text-gray-500">{symbol}</div>
            </div>
        </div>
        <div className="mt-4 text-sm">
            <div>Quantity: {quantity}</div>
            <div>Price: ${currentPrice.toFixed(2)}</div>
            <div className={change >= 0 ? "text-green-500" : "text-red-500"}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
            </div>
        </div>
        </div>
    );
}
