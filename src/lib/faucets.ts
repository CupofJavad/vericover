/** Base Sepolia testnet faucets — VeriCover runs on chain 84532 only. */
export const baseSepoliaFaucets = [
  {
    name: "ETHGlobal",
    url: "https://ethglobal.com/faucet/base-sepolia-84532",
    note: "Free login (GitHub) · 0.05 ETH · no mainnet balance required",
    recommended: true,
  },
  {
    name: "Coinbase CDP",
    url: "https://portal.cdp.coinbase.com/products/faucet",
    note: "Free CDP account · ETH + USDC · usually no mainnet balance",
    recommended: true,
  },
  {
    name: "thirdweb",
    url: "https://thirdweb.com/base-sepolia-testnet",
    note: "thirdweb login · 0.01 ETH/day · no mainnet balance",
    recommended: true,
  },
  {
    name: "Alchemy",
    url: "https://www.alchemy.com/faucets/base-sepolia",
    note: "Requires 0.001 ETH on Ethereum mainnet — skip if you don't have it",
    recommended: false,
  },
  {
    name: "Chainlink",
    url: "https://faucets.chain.link/base-sepolia",
    note: "Native ETH requires 1 LINK on Ethereum mainnet — skip unless you have LINK",
    recommended: false,
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
    name: "Bware Labs",
    url: "https://bwarelabs.com/faucets/base-sepolia",
    note: "No registration · 1 claim / 24h",
    recommended: false,
  },
] as const;

export const faucetDocsUrl =
  "https://docs.base.org/base-chain/network-information/network-faucets";