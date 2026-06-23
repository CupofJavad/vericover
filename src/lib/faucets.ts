/** Base Sepolia testnet faucets — VeriCover runs on chain 84532 only. */
export const baseSepoliaFaucets = [
  {
    name: "Chainlink",
    url: "https://faucets.chain.link/base-sepolia",
    note: "No account required · connect wallet or paste address",
    recommended: true,
  },
  {
    name: "thirdweb",
    url: "https://thirdweb.com/base-sepolia-testnet",
    note: "Social or wallet login · 1 claim / 24h",
    recommended: true,
  },
  {
    name: "Alchemy",
    url: "https://www.alchemy.com/faucets/base-sepolia",
    note: "Free Alchemy account · 1 claim / 24h",
    recommended: true,
  },
  {
    name: "QuickNode",
    url: "https://faucet.quicknode.com/base/sepolia",
    note: "Wallet connect · 1 drip / 12h",
    recommended: false,
  },
  {
    name: "Ethereum Ecosystem",
    url: "https://www.ethereum-ecosystem.com/faucets/base-sepolia",
    note: "Generous drips · no login · 0.5 ETH / 24h",
    recommended: true,
  },
  {
    name: "GetBlock",
    url: "https://getblock.io/faucet/base-sepolia/",
    note: "Paste address · captcha may apply",
    recommended: false,
  },
  {
    name: "Coinbase CDP",
    url: "https://portal.cdp.coinbase.com/products/faucet",
    note: "CDP account · ETH + USDC · programmatic API available",
    recommended: false,
  },
  {
    name: "Bware Labs",
    url: "https://bwarelabs.com/faucets/base-sepolia",
    note: "No registration · 1 claim / 24h",
    recommended: false,
  },
] as const;

export const faucetDocsUrl =
  "https://docs.base.org/base-chain/network-information/network-faucets";