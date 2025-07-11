export interface FanTokenData {
    link: string;
    image: string;
    name: string;
    symbol: string;
    tokenAddress?: string; // Optional, as not all tokens may have an address
    testnetTokenAddress?: string; // Optional, for testnet tokens
}

export type FanTokenMap = {
[teamName: string]: FanTokenData;
};

export const FAN_TOKENS: FanTokenMap[] = [
{
    PSG: {
    link: "https://www.socios.com/psg",
    image: "https://actufinance.fr/wp-content/uploads/2022/02/PSG.png",
    name: "Paris Saint-Germain Fan Token",
    symbol: "PSG",
    tokenAddress: "0x0b8f3c1d2e6a4b5c7f8e9d1a2b3c4d5e6f7g8h9i",
    },
},
{
    JUV: {
    link: "https://www.socios.com/juventus",
    image:
        "https://coin-images.coingecko.com/coins/images/10060/large/JUV.png?1741579269",
    name: "Juventus Fan Token",
    symbol: "JUV",
    },
},
{
    BAR: {
    link: "https://www.socios.com/fcbarcelona",
    image: "https://cdn.socios.com/club/fcbarcelona.png",
    name: "FC Barcelona Fan Token",
    symbol: "BAR",
    },
},
];
  