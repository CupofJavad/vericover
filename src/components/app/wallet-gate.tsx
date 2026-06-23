"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { ConnectButton } from "@/components/wallet/connect-button";
import { Button } from "@/components/ui/button";

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { isConnected, isConnecting, isReconnecting } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  if (isConnecting || isReconnecting) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#131f35] p-8 text-center">
        <p className="text-slate-400">Restoring wallet session…</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#131f35] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">Connect your wallet</h2>
        <p className="mb-6 text-sm text-slate-400">
          Connect to <strong className="text-teal-300">Base Sepolia</strong> to
          buy cover, register product warranties, view policies, or stake as an LP.
          Works with Coinbase Wallet, MetaMask, Rabby, and other browser wallets.
        </p>
        <ConnectButton className="flex justify-center" />
        <p className="mt-4 text-xs text-slate-500">
          Need testnet funds?{" "}
          <a
            href="https://portal.cdp.coinbase.com/products/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline"
          >
            Coinbase Faucet (ETH + USDC)
          </a>
        </p>
      </div>
    );
  }

  if (chainId !== baseSepolia.id) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-[#131f35] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-amber-200">Wrong network</h2>
        <p className="mb-6 text-sm text-slate-400">
          VeriCover runs on Base Sepolia testnet. Switch your wallet network to
          continue.
        </p>
        <Button
          onClick={() => switchChain({ chainId: baseSepolia.id })}
          disabled={isSwitching}
          className="bg-amber-500 font-semibold text-[#060b14] hover:bg-amber-400"
        >
          {isSwitching ? "Switching…" : "Switch to Base Sepolia"}
        </Button>
        <div className="mt-4 flex justify-center">
          <ConnectButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}