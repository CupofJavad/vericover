"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  products,
  calculatePremium,
  type ProductId,
} from "@/lib/products";
import {
  savePolicy,
  getNextTokenId,
  generateTxHash,
} from "@/lib/policies";
import { LinkButton } from "@/components/ui/link-button";

export default function BuyCoverPage() {
  const { address } = useAccount();
  const [selected, setSelected] = useState<ProductId>("depeg");
  const [coverage, setCoverage] = useState(10000);
  const [days, setDays] = useState(90);
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState<number | null>(null);

  const product = products.find((p) => p.id === selected)!;
  const premium = calculatePremium(product, coverage, days);
  const valid =
    coverage >= product.minCoverage &&
    coverage <= product.maxCoverage &&
    days >= product.minDays &&
    days <= product.maxDays;

  async function handlePurchase() {
    if (!address || !valid) return;
    setPurchasing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const tokenId = getNextTokenId(address);
    const now = Date.now();
    savePolicy(address, {
      id: `${address}-${tokenId}`,
      tokenId,
      productId: selected,
      productName: product.name,
      coverage,
      premium,
      days,
      beneficiary: address,
      purchasedAt: now,
      expiresAt: now + days * 86400000,
      status: "active",
      txHash: generateTxHash(),
    });
    setSuccess(tokenId);
    setPurchasing(false);
  }

  if (success !== null) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-teal-400/30 bg-[#131f35] p-8 text-center">
        <div className="mb-4 text-4xl">✓</div>
        <h2 className="text-xl font-semibold text-teal-300">Policy purchased!</h2>
        <p className="mt-2 text-slate-400">
          Policy NFT #{success} minted. Coverage: ${coverage.toLocaleString()} ·
          Premium: ${premium} USDC
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/app/policies" className="bg-teal-400 text-[#060b14]">
            View My Policies
          </LinkButton>
          <LinkButton href="/app/buy" variant="outline" className="border-white/15 text-white">
            Buy another
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <WalletGate>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Buy Cover</h1>
          <p className="mt-1 text-slate-400">
            Select a parametric product and get an instant quote
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            {products.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelected(p.id);
                  setCoverage(Math.min(10000, p.maxCoverage));
                  setDays(Math.min(90, p.maxDays));
                }}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected === p.id
                    ? "border-teal-400/40 bg-teal-400/10"
                    : "border-white/10 bg-[#131f35] hover:border-white/20"
                }`}
              >
                <Badge variant="outline" className="mb-2 border-teal-400/30 text-teal-300">
                  {p.tag}
                </Badge>
                <p className="font-semibold">{p.name}</p>
                <p className="mt-1 text-xs text-slate-400">{p.trigger}</p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6 lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">{product.name}</h2>
            <p className="mb-6 text-sm text-slate-400">{product.description}</p>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Coverage amount (USDC): ${coverage.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={product.minCoverage}
                  max={product.maxCoverage}
                  step={500}
                  value={coverage}
                  onChange={(e) => setCoverage(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>${product.minCoverage.toLocaleString()}</span>
                  <span>${product.maxCoverage.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Duration: {days} days
                </label>
                <input
                  type="range"
                  min={product.minDays}
                  max={product.maxDays}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
              </div>

              <div className="rounded-xl border border-teal-400/20 bg-teal-400/5 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Premium due</span>
                  <span className="text-xl font-bold text-teal-300">
                    ${premium.toFixed(2)} USDC
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Premium flows to the ReservePool. Policy terms locked at purchase.
                </p>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={!valid || purchasing}
                className="w-full bg-teal-400 py-6 text-base font-semibold text-[#060b14] hover:bg-teal-300"
              >
                {purchasing ? "Processing…" : `Pay $${premium.toFixed(2)} USDC & Get Policy NFT`}
              </Button>

              {!valid && (
                <p className="text-xs text-amber-400">
                  Adjust coverage or duration to fit product limits.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </WalletGate>
  );
}