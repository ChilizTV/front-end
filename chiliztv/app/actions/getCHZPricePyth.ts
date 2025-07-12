'use server';

import { HermesClient } from "@pythnetwork/hermes-client";

export async function getCHZPricePyth() {
    const connection = new HermesClient("https://hermes.pyth.network", {}); // See Hermes endpoints section below for other endpoints

const priceIds = [
  // You can find the ids of prices at https://pyth.network/developers/price-feed-ids
  "0xe799f456b358a2534aa1b45141d454ac04b444ed23b1440b778549bb758f2b5c", // CHZ/USD price id
];

// Latest price updates
const priceUpdates = await connection.getLatestPriceUpdates(priceIds);

return priceUpdates;
}