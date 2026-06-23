"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectButton({ className }: { className?: string }) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className ?? ""}`}>
        {chain && (
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400 sm:inline">
            {chain.name}
          </span>
        )}
        <Button
          variant="outline"
          onClick={() => disconnect()}
          className="border-white/15 bg-white/5 font-mono text-sm text-white hover:bg-white/10"
        >
          {truncate(address)}
        </Button>
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <div className={className}>
      <Button
        onClick={() => connector && connect({ connector })}
        disabled={isPending || !connector}
        className="bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
      >
        {isPending ? "Connecting…" : "Connect Wallet"}
      </Button>
      {error && (
        <p className="mt-2 text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
}