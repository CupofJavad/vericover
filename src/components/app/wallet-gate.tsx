"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { ConnectButton } from "@/components/wallet/connect-button";
import { FaucetLinks } from "@/components/app/faucet-links";
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
        <p className="mb-3 text-sm text-slate-300">
          VeriCover uses a secure digital account (your crypto wallet) to register
          products and file claims — like logging into My Account at SquareTrade.
        </p>
        <p className="mb-6 text-xs text-slate-500">
          Works with Coinbase Wallet, MetaMask, and other browser wallets on{" "}
          <strong className="text-teal-300/90">Base Sepolia</strong> testnet.
        </p>
        <ConnectButton className="flex justify-center" />
        <div className="mt-6 text-left">
          <FaucetLinks compact />
        </div>
      </div>
    );
  }

  if (chainId !== baseSepolia.id) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-amber-500/30 bg-[#131f35] p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-amber-200">Switch network to continue</h2>
        <p className="mb-6 text-sm text-slate-400">
          Your account needs to be on the VeriCover test network (Base Sepolia) before
          you can register products or file claims.
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