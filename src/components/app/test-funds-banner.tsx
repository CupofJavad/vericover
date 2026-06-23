"use client";

import { useState } from "react";
import { useConnection, useBalance } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { formatEther } from "viem";
import { baseSepoliaFaucets } from "@/lib/faucets";
import { Button } from "@/components/ui/button";

const LOW_ETH_THRESHOLD = 0.001;

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function TestFundsBanner() {
  const { address, isConnected, chainId } = useConnection();
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { data: balance } = useBalance({
    address,
    chainId: baseSepolia.id,
    query: { enabled: !!address && chainId === baseSepolia.id },
  });

  if (!isConnected || !address || chainId !== baseSepolia.id || dismissed) {
    return null;
  }

  const eth = balance ? Number(formatEther(balance.value)) : 0;
  const needsFunds = eth < LOW_ETH_THRESHOLD;
  const recommended = baseSepoliaFaucets.filter((f) => f.recommended).slice(0, 3);

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`mb-6 rounded-2xl border p-4 md:p-5 ${
        needsFunds
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-teal-400/20 bg-teal-400/5"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {needsFunds ? "Get testnet ETH for gas" : "Testnet funds"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {needsFunds
              ? "Your wallet needs Base Sepolia ETH to send transactions. USDC for LP reads on-chain separately."
              : `You have ${eth.toFixed(4)} ETH on Base Sepolia. Need more? Use a faucet below.`}
          </p>
          <p className="mt-2 font-mono text-xs text-slate-300">
            {address}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void copyAddress()}
            className="border-white/15 bg-white/5 text-xs text-white hover:bg-white/10"
          >
            {copied ? "Copied!" : "Copy address"}
          </Button>
          {!needsFunds && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setDismissed(true)}
              className="border-white/15 bg-white/5 text-xs text-slate-400 hover:bg-white/10"
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {recommended.map((faucet) => (
          <a
            key={faucet.url}
            href={faucet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-teal-400 px-3 py-2 text-xs font-semibold text-[#060b14] transition hover:bg-teal-300"
          >
            {faucet.name} faucet →
          </a>
        ))}
        <a
          href="https://portal.cdp.coinbase.com/products/faucet"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/5"
        >
          Coinbase faucet (ETH + USDC)
        </a>
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        Connected as {truncate(address)} · Paste your address or connect the same
        wallet on the faucet site. Chainlink is the fastest (0.5 ETH).
      </p>
    </div>
  );
}