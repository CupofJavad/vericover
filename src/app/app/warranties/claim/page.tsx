"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
import { FlowStepper } from "@/components/app/flow-stepper";
import { WhatHappensNext, type TimelineStep } from "@/components/app/what-happens-next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { warrantyClaimManagerAbi, claimTypeOnChain } from "@/lib/abis/warranty-claim-manager";
import { warrantyContracts, isWarrantyRailDeployed } from "@/lib/contracts";
import {
  getPassports,
  getClaims,
  submitClaim,
  simulateClaimProgress,
  claimTypeLabels,
  claimStatusLabels,
  formatWarrantyId,
  warrantyCatalog,
  type ClaimType,
  type ProductPassport,
  type WarrantyClaim,
} from "@/lib/warranties";

const CLAIM_STEPS = [
  { id: "product", label: "Your product" },
  { id: "type", label: "Resolution" },
  { id: "details", label: "What happened" },
  { id: "submit", label: "Submit" },
];

const CLAIM_TYPE_HINTS: Record<ClaimType, string> = {
  repair: "Send to an authorized repair center — best for fixable issues.",
  replace: "Receive a replacement unit — common for earbuds and accessories.",
  refund: "Receive reimbursement — when repair or replace isn't practical.",
};

const claimStatusColors: Record<WarrantyClaim["status"], string> = {
  submitted: "border-amber-400/30 text-amber-300",
  under_review: "border-blue-400/30 text-blue-300",
  approved: "border-emerald-400/30 text-emerald-300",
  rejected: "border-red-400/30 text-red-300",
  paid: "border-teal-400/30 text-teal-300",
};

function estimatePayout(productSku: string, claimType: ClaimType): number {
  const product = warrantyCatalog.find((p) => p.sku === productSku);
  const max = product?.maxClaimValue ?? 100;
  if (claimType === "refund") return max * 0.8;
  if (claimType === "replace") return max;
  return max * 0.3;
}

function claimTimelineForType(claimType: ClaimType): TimelineStep[] {
  const resolution =
    claimType === "repair"
      ? "Repair center schedules service or sends a shipping label."
      : claimType === "replace"
        ? "Replacement ships to your address — like SquareTrade fulfillment."
        : "Reimbursement is processed to your account.";

  return [
    {
      title: "Claim submitted",
      description: "We've received your request and notified the manufacturer.",
      status: "complete",
    },
    {
      title: "Under review",
      description:
        "The manufacturer verifies coverage and reviews what happened. Usually 1–3 business days.",
      status: "current",
    },
    {
      title: "Decision",
      description: "You'll see Approved or Not approved in My Products.",
      status: "upcoming",
    },
    {
      title: claimTypeLabels[claimType],
      description: resolution,
      status: "upcoming",
    },
  ];
}

function statusToTimelineIndex(status: WarrantyClaim["status"]): number {
  switch (status) {
    case "submitted":
      return 1;
    case "under_review":
      return 2;
    case "approved":
      return 3;
    case "paid":
      return 4;
    case "rejected":
      return 3;
    default:
      return 1;
  }
}

function claimProgressTimeline(
  claim: WarrantyClaim,
  claimType: ClaimType
): TimelineStep[] {
  const base = claimTimelineForType(claimType);
  const idx = statusToTimelineIndex(claim.status);

  return base.map((step, i) => {
    const stepNum = i + 1;
    if (claim.status === "rejected" && stepNum === 3) {
      return {
        title: "Not approved",
        description: "This request wasn't covered under your plan. Contact support if you have questions.",
        status: "current" as const,
      };
    }
    if (stepNum < idx) return { ...step, status: "complete" as const };
    if (stepNum === idx) return { ...step, status: "current" as const };
    return { ...step, status: "upcoming" as const };
  });
}

export default function WarrantyClaimPage() {
  const { address } = useAccount();
  const [step, setStep] = useState(1);
  const [passports, setPassports] = useState<ProductPassport[]>([]);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [claimType, setClaimType] = useState<ClaimType>("repair");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<WarrantyClaim | null>(null);
  const onChain = isWarrantyRailDeployed();

  const selectedPassport = passports.find((p) => p.id === selectedId);

  const {
    writeContract,
    data: txHash,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (address) {
      const list = getPassports(address).filter((p) => p.status === "active");
      setPassports(list);
      setClaims(getClaims(address));
      if (list.length > 0 && !selectedId) setSelectedId(list[0].id);
    }
  }, [address, selectedId]);

  useEffect(() => {
    if (!isConfirmed || !address || !selectedPassport || !txHash) return;
    const payout = estimatePayout(selectedPassport.sku, claimType);
    const claim: WarrantyClaim = {
      id: `${selectedPassport.id}-claim-${Date.now()}`,
      passportId: selectedPassport.id,
      tokenId: selectedPassport.tokenId,
      productName: selectedPassport.productName,
      claimType,
      description: description.trim(),
      status: "submitted",
      submittedAt: Date.now(),
      payoutAmount: payout,
      txHash,
    };
    const key = address.toLowerCase();
    const raw = localStorage.getItem("vericover_warranty_claims_v1");
    const all: Record<string, WarrantyClaim[]> = raw ? JSON.parse(raw) : {};
    const list = all[key] ?? [];
    all[key] = [claim, ...list];
    localStorage.setItem("vericover_warranty_claims_v1", JSON.stringify(all));
    setSuccess(claim);
    setClaims(getClaims(address));
  }, [isConfirmed, address, selectedPassport, txHash, claimType, description]);

  useEffect(() => {
    if (writeError) setError(writeError.message.split("\n")[0]);
  }, [writeError]);

  function goNext() {
    setError(null);
    if (step < 4) setStep((s) => s + 1);
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSubmit() {
    if (!address || !selectedId) return;
    setError(null);

    const passport = passports.find((p) => p.id === selectedId);
    if (!passport) return;

    if (onChain) {
      const payout = estimatePayout(passport.sku, claimType);
      const amount = BigInt(Math.round(payout * 1_000_000));
      writeContract({
        address: warrantyContracts.warrantyClaimManager,
        abi: warrantyClaimManagerAbi,
        functionName: "submitClaim",
        args: [
          BigInt(passport.tokenId),
          claimTypeOnChain[claimType],
          amount,
          `ipfs://vericover/claim/${passport.tokenId}/${Date.now()}`,
        ],
      });
      return;
    }

    const result = submitClaim(address, selectedId, claimType, description);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess(result.claim);
    setClaims(getClaims(address));
  }

  function handleAdvance(claimId: string) {
    if (!address) return;
    simulateClaimProgress(address, claimId);
    setClaims(getClaims(address));
  }

  const loading = isWriting || isConfirming;
  const estPayout =
    selectedPassport != null ? estimatePayout(selectedPassport.sku, claimType) : 0;

  if (success) {
    const manufacturer =
      warrantyCatalog.find((p) => p.name === success.productName)?.manufacturer ??
      "your manufacturer";

    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-2xl border border-emerald-400/30 bg-[#131f35] p-8 text-center">
          <div className="mb-4 text-4xl">📋</div>
          <h2 className="text-xl font-semibold text-emerald-300">Claim submitted</h2>
          <p className="mt-2 text-slate-400">
            {claimTypeLabels[success.claimType]} request for {success.productName}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Estimated coverage up to ${success.payoutAmount?.toFixed(2)} — funded by{" "}
            {manufacturer}
          </p>
          {onChain && (
            <details className="mt-3 text-left">
              <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-400">
                Verification details
              </summary>
              <a
                href={`https://sepolia.basescan.org/tx/${success.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-emerald-400/80 hover:underline"
              >
                View permanent claim record →
              </a>
            </details>
          )}
          <LinkButton href="/app/warranties" className="mt-6 bg-emerald-400 text-[#060b14]">
            Track in My Products
          </LinkButton>
        </div>

        <WhatHappensNext steps={claimTimelineForType(success.claimType)} />
      </div>
    );
  }

  return (
    <WalletGate>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">File a warranty claim</h1>
          <p className="mt-1 text-slate-400">
            Four steps — tell us what happened, same as filing with Assurion or SquareTrade.
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
          <>
            <FlowStepper steps={CLAIM_STEPS} currentStep={loading ? 4 : step} />

            <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Step 1 of 4</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Which registered product needs service?
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">
                      Registered product
                    </label>
                    <select
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white focus:border-emerald-400/50 focus:outline-none"
                    >
                      {passports.map((p) => (
                        <option key={p.id} value={p.id}>
                          {formatWarrantyId(p.tokenId)} — {p.productName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedPassport && (
                    <p className="text-xs text-slate-500">
                      Covered by {selectedPassport.manufacturer} · Serial{" "}
                      {selectedPassport.serialNumber}
                    </p>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Step 2 of 4</p>
                    <p className="mt-1 text-sm text-slate-400">
                      How would you like this resolved?
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["repair", "replace", "refund"] as ClaimType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setClaimType(t)}
                        className={`rounded-xl border p-4 text-left transition ${
                          claimType === t
                            ? "border-emerald-400/40 bg-emerald-400/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <p
                          className={`text-sm font-semibold ${
                            claimType === t ? "text-emerald-300" : "text-slate-200"
                          }`}
                        >
                          {claimTypeLabels[t]}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{CLAIM_TYPE_HINTS[t]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Step 3 of 4</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Tell us what happened and when — the more detail, the faster we can help.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="desc" className="mb-2 block text-sm text-slate-300">
                      Describe the issue
                    </label>
                    <textarea
                      id="desc"
                      rows={5}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setError(null);
                      }}
                      placeholder="Screen flickering after 2 weeks of normal use. Device powers on but display goes black within 30 seconds."
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      {description.trim().length}/20 characters minimum
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && selectedPassport && (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Step 4 of 4 — Review</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Confirm before submitting to the manufacturer.
                    </p>
                  </div>
                  <dl className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                    <ReviewRow label="Product" value={selectedPassport.productName} />
                    <ReviewRow
                      label="Warranty ID"
                      value={formatWarrantyId(selectedPassport.tokenId)}
                      mono
                    />
                    <ReviewRow label="Resolution" value={claimTypeLabels[claimType]} />
                    <ReviewRow
                      label="Est. coverage"
                      value={`Up to $${estPayout.toFixed(2)}`}
                    />
                    <div>
                      <dt className="text-slate-500">Issue description</dt>
                      <dd className="mt-1 text-sm text-slate-300">{description.trim()}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {error && (
                <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {step > 1 && !loading && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    className="border-white/15 text-white"
                  >
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={
                      (step === 1 && !selectedId) ||
                      (step === 3 && description.trim().length < 20)
                    }
                    className="flex-1 bg-emerald-400 text-[#060b14] hover:bg-emerald-300 sm:flex-none"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || description.trim().length < 20}
                    className="flex-1 bg-emerald-400 py-3 text-base font-semibold text-[#060b14] hover:bg-emerald-300 sm:flex-none"
                  >
                    {loading
                      ? isConfirming
                        ? "Submitting your claim…"
                        : "Approve in your wallet app…"
                      : "Submit warranty request"}
                  </Button>
                )}
              </div>
            </div>

            {step < 4 && (
              <WhatHappensNext
                steps={[
                  {
                    title: "Select your product",
                    description: "Choose from products you've already registered.",
                    status: step > 1 ? "complete" : "current",
                  },
                  {
                    title: "Pick repair, replacement, or refund",
                    description: "Same options you'd see with any protection plan provider.",
                    status: step > 2 ? "complete" : step === 2 ? "current" : "upcoming",
                  },
                  {
                    title: "Describe what happened",
                    description: "Include when it started and what you've tried.",
                    status: step > 3 ? "complete" : step === 3 ? "current" : "upcoming",
                  },
                  {
                    title: "Manufacturer reviews your claim",
                    description: "Track status in My Products — repair, ship, or reimburse.",
                    status: "upcoming",
                  },
                ]}
              />
            )}
          </>
        )}

        {claims.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Your claims</h2>
            {!onChain && (
              <p className="text-xs text-slate-500">
                Demo mode: tap Advance to simulate manufacturer review stages.
              </p>
            )}
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
                <WhatHappensNext
                  title="Claim progress"
                  className="mt-4 border-white/5 bg-black/10 p-4"
                  steps={claimProgressTimeline(c, c.claimType)}
                />
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{claimTypeLabels[c.claimType]}</span>
                  {c.payoutAmount != null && (
                    <span>Est. coverage ${c.payoutAmount.toFixed(2)}</span>
                  )}
                  {onChain && c.txHash && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${c.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-emerald-400/80 hover:underline"
                    >
                      Verification →
                    </a>
                  )}
                  {!onChain && c.status !== "paid" && c.status !== "rejected" && (
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

function ReviewRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className={mono ? "font-mono text-xs text-slate-200" : "text-right text-slate-200"}>
        {value}
      </dd>
    </div>
  );
}