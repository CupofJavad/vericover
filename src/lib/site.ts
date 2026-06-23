export const siteConfig = {
  name: "VeriCover",
  tagline: "Insurance finances, fully on-chain.",
  description:
    "VeriCover is a decentralized parametric risk-sharing protocol on Base. Immutable policy NFTs, transparent USDC reserve pools, and automated claims — built by Javad.",
  url: "https://cupofjavad.github.io/vericover",
  founder: {
    name: "Javad",
    handle: "@Zarathustra_F",
    xUrl: "https://x.com/Zarathustra_F",
  },
  chain: "Base",
  status: "Early access — Base Sepolia testnet",
} as const;

export const lpEconomics = {
  lpShare: "73%",
  protocolFee: "12%",
  riskBuffer: "15%",
  targetApy: "6–12%",
  minLockDays: 14,
} as const;

export const transparencyProof = [
  {
    label: "Policy terms",
    detail: "Encoded immutably in ERC-721 metadata + on-chain struct",
  },
  {
    label: "Premium flow",
    detail: "USDC transfers emit events — traceable to ReservePool",
  },
  {
    label: "Pool solvency",
    detail: "MCR ratio, utilization, and free liquidity on-chain",
  },
  {
    label: "Claim execution",
    detail: "Parametric triggers + payout txs verifiable on Basescan",
  },
] as const;