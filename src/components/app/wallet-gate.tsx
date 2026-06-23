"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@/components/wallet/connect-button";

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#131f35] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">Connect your wallet</h2>
        <p className="mb-6 text-sm text-slate-400">
          Connect to Base Sepolia to buy cover, view policies, or stake as an LP.
          Use Coinbase Wallet or any browser wallet (MetaMask, Rabby, etc.).
        </p>
        <ConnectButton className="flex justify-center" />
        <p className="mt-4 text-xs text-slate-500">
          Need testnet USDC?{" "}
          <a
            href="https://portal.cdp.coinbase.com/products/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline"
          >
            Coinbase Faucet
          </a>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}