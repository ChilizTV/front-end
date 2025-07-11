// utils/FanTokens.ts

export interface FanTokenData {
    link: string;
    image: string;
    name: string;
    symbol: string;
}
  
  // This represents one object in the FAN_TOKENS array
export type FanTokenMap = {
[teamName: string]: FanTokenData;
};

// Full FAN_TOKENS type
export const FAN_TOKENS: FanTokenMap[] = [
{
    "PSG": {
    link: "https://www.socios.com/psg",
    image: "https://actufinance.fr/wp-content/uploads/2022/02/PSG.png",
    name: "Paris Saint-Germain Fan Token",
    symbol: "PSG",
    },
},
{
    "JUV": {
    link: "https://www.socios.com/juventus",
    image: "https://coin-images.coingecko.com/coins/images/10060/large/JUV.png?1741579269",
    name: "Juventus Fan Token",
    symbol: "JUV",
    },
},
{
    "BAR": {
    link: "https://www.socios.com/fcbarcelona",
    image: "https://cdn.socios.com/club/fcbarcelona.png",
    name: "FC Barcelona Fan Token",
    symbol: "BAR",
    },
},
];
