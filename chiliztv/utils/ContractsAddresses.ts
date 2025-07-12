export const CONTRACTS_ADDRESSES = {
    betting: process.env.NEXT_PUBLIC_BETTING_CONTRACT_ADDRESS as `0x${string}`,
} as const;

export type ContractAddress = keyof typeof CONTRACTS_ADDRESSES;