import { http, createConfig, createStorage } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected, coinbaseWallet, metaMask } from "wagmi/connectors";
import { siteConfig } from "./site";

export const USDC_BASE_SEPOLIA =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

export const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
] as const;

const dappOrigin =
  typeof window !== "undefined" ? window.location.origin : siteConfig.url;

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: true,
  connectors: [
    metaMask({
      dapp: {
        name: siteConfig.name,
        url: dappOrigin,
      },
    }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: siteConfig.name,
      preference: "all",
    }),
  ],
  storage:
    typeof window !== "undefined"
      ? createStorage({ storage: window.localStorage })
      : undefined,
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC ?? "https://sepolia.base.org"
    ),
  },
  ssr: true,
});