export type ProductId = "depeg" | "flight" | "exploit";

export interface Product {
  id: ProductId;
  name: string;
  tag: string;
  description: string;
  trigger: string;
  rateBps: number; // premium per 90 days per $1000 coverage
  minCoverage: number;
  maxCoverage: number;
  minDays: number;
  maxDays: number;
}

export const products: Product[] = [
  {
    id: "depeg",
    name: "Stablecoin Depeg Cover",
    tag: "DeFi",
    description: "Protection when USDC or USDT trades below $0.995 for 24 hours.",
    trigger: "Price < $0.995 sustained → automatic payout",
    rateBps: 50,
    minCoverage: 500,
    maxCoverage: 100000,
    minDays: 30,
    maxDays: 365,
  },
  {
    id: "flight",
    name: "Flight Delay Cover",
    tag: "Travel",
    description: "Payout when your flight is delayed 60+ minutes or cancelled.",
    trigger: "Aviation data oracle · tiered payouts",
    rateBps: 200,
    minCoverage: 100,
    maxCoverage: 5000,
    minDays: 1,
    maxDays: 7,
  },
  {
    id: "exploit",
    name: "DeFi Exploit Cover",
    tag: "Crypto",
    description: "Cover against smart contract exploits on supported protocols.",
    trigger: "Multi-signal detection + confirmation window",
    rateBps: 150,
    minCoverage: 1000,
    maxCoverage: 250000,
    minDays: 30,
    maxDays: 180,
  },
];

export function getProduct(id: ProductId): Product | undefined {
  return products.find((p) => p.id === id);
}

export function calculatePremium(
  product: Product,
  coverage: number,
  days: number
): number {
  const annualized = (coverage * product.rateBps) / 10000;
  return Math.round(((annualized * days) / 90) * 100) / 100;
}