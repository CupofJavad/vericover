"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import {
  getPassports,
  getClaims,
  submitClaim,
  simulateClaimProgress,
  claimTypeLabels,
  claimStatusLabels,
  type ClaimType,
  type ProductPassport,
  type WarrantyClaim,
} from "@/lib/warranties";

const claimStatusColors: Record<WarrantyClaim["status"], string> = {
  submitted: "border-amber-400/30 text-amber-300",
  under_review: "border-blue-400/30 text-blue-300",
  approved: "border-emerald-400/30 text-emerald-300",
  rejected: "border-red-400/30 text-red-300",
  paid: "border-teal-400/30 text-teal-300",
};

export default function WarrantyClaimPage() {
  const { address } = useAccount();
  const [passports, setPassports] = useState<ProductPassport[]>([]);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [claimType, setClaimType] = useState<ClaimType>("repair");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<WarrantyClaim | null>(null);

  useEffect(() => {
    if (address) {
      const list = getPassports(address).filter((p) => p.status === "active");
      setPassports(list);
      setClaims(getClaims(address));
      if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
    }
  }, [address, selectedId]);

  async function handleSubmit() {
    if (!address || !selectedId) return;
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 800));
    const result = submitClaim(address, selectedId, claimType, description);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setSuccess(result.claim);
    setClaims(getClaims(address));
    setLoading(false);
  }

  function handleAdvance(claimId: string) {
    if (!address) return;
    simulateClaimProgress(address, claimId);
    setClaims(getClaims(address));
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-400/30 bg-[#131f35] p-8 text-center">
        <div className="mb-4 text-4xl">📋</div>
        <h2 className="text-xl font-semibold text-emerald-300">Claim submitted</h2>
        <p className="mt-2 text-slate-400">
          {claimTypeLabels[success.claimType]} request for {success.productName}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Est. payout up to ${success.payoutAmount?.toFixed(2)} USDC from manufacturer tranche
        </p>
        <LinkButton href="/app/warranties" className="mt-6 bg-emerald-400 text-[#060b14]">
          Back to warranties
        </LinkButton>
      </div>
    );
  }

  return (
    <WalletGate>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">File a warranty claim</h1>
          <p className="mt-1 text-slate-400">
            Repair, replacement, or refund — reviewed by the manufacturer. Payouts come from
            their dedicated tranche vault, not the parametric insurance pool.
          </p>
        </div>

        {passports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
            <p className="text-slate-400">Register a product before filing a claim.</p>
            <LinkButton
              href="/app/warranties/register"
              className="mt-4 bg-emerald-400 text-[#060b14]"
            >
              Register product
            </LinkButton>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Product passport</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
              >
                {passports.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.tokenId} — {p.productName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Claim type</label>
              <div className="flex flex-wrap gap-2">
                {(["repair", "replace", "refund"] as ClaimType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setClaimType(t)}
                    className={`rounded-lg border px-4 py-2 text-sm transition ${
                      claimType === t
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                        : "border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {claimTypeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="desc" className="mb-2 block text-sm text-slate-300">
                Describe the issue
              </label>
              <textarea
                id="desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Screen flickering after 2 weeks of normal use. Device powers on but display goes black within 30 seconds."
                className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading || description.trim().length < 20}
              className="w-full bg-emerald-400 py-6 text-base font-semibold text-[#060b14] hover:bg-emerald-300"
            >
              {loading ? "Submitting…" : "Submit warranty claim"}
            </Button>
          </div>
        )}

        {claims.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Your claims</h2>
            <p className="text-xs text-slate-500">
              Testnet demo: tap Advance to simulate manufacturer review stages.
            </p>
            {claims.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-white/10 bg-[#131f35] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{c.productName}</span>
                  <Badge variant="outline" className={claimStatusColors[c.status]}>
                    {claimStatusLabels[c.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-slate-400">{c.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{claimTypeLabels[c.claimType]}</span>
                  {c.payoutAmount != null && (
                    <span>Est. ${c.payoutAmount.toFixed(2)} USDC</span>
                  )}
                  {c.status !== "paid" && c.status !== "rejected" && (
                    <button
                      type="button"
                      onClick={() => handleAdvance(c.id)}
                      className="text-emerald-400 hover:underline"
                    >
                      Advance status →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </WalletGate>
  );
}