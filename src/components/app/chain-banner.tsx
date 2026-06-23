"use client";

import { useAccount, useChainId } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { isWarrantyRailDeployed, deployedMeta } from "@/lib/contracts";

export function ChainBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const onChain = isWarrantyRailDeployed();

  if (!isConnected) return null;

  const wrongNetwork = chainId !== baseSepolia.id;

  return (
    <div
      className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
        wrongNetwork
          ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
          : onChain
            ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-100/90"
            : "border-teal-400/20 bg-teal-400/5 text-slate-300"
      }`}
    >
      {wrongNetwork ? (
        <span>Switch to the VeriCover test network to register products or file claims.</span>
      ) : onChain ? (
        <span>
          You&apos;re signed in · Product protection is active
          {deployedMeta.deployedAt
            ? ` (live since ${new Date(deployedMeta.deployedAt).toLocaleDateString()})`
            : ""}
        </span>
      ) : (
        <span>
          You&apos;re signed in · Demo mode — try registering a product and filing a claim.
          Full protection goes live when contracts are deployed.
        </span>
      )}
    </div>
  );
}