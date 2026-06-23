"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
import { FlowStepper } from "@/components/app/flow-stepper";
import { WhatHappensNext } from "@/components/app/what-happens-next";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { warrantyRedemptionAbi } from "@/lib/abis/warranty-redemption";
import { productPassportAbi } from "@/lib/abis/product-passport";
import { warrantyContracts, isWarrantyRailDeployed } from "@/lib/contracts";
import {
  registerPassport,
  warrantyCatalog,
  claimCodeHash,
  validatePassportRegistration,
  savePassportFromChain,
  onChainSerialHash,
  formatWarrantyId,
  type ProductPassport,
} from "@/lib/warranties";

const REGISTER_STEPS = [
  { id: "code", label: "Registration code" },
  { id: "serial", label: "Serial number" },
  { id: "confirm", label: "Confirm" },
];

export default function RegisterWarrantyPage() {
  const { address } = useAccount();
  const [step, setStep] = useState(1);
  const [claimCode, setClaimCode] = useState("");
  const [serial, setSerial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passport, setPassport] = useState<ProductPassport | null>(null);
  const onChain = isWarrantyRailDeployed();

  const {
    writeContract,
    data: txHash,
    isPending: isWriting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const validated =
    claimCode && serial
      ? validatePassportRegistration(claimCode, serial)
      : null;
  const product = validated && validated.ok ? validated.product : null;
  const serialNorm = validated && validated.ok ? validated.serial : "";

  const { data: tokenIdOnChain } = useReadContract({
    address: warrantyContracts.productPassport721,
    abi: productPassportAbi,
    functionName: "serialToTokenId",
    args:
      product && serialNorm && isConfirmed
        ? [onChainSerialHash(serialNorm, product.sku)]
        : undefined,
    query: { enabled: onChain && isConfirmed && !!product && !!serialNorm },
  });

  useEffect(() => {
    if (!isConfirmed || !address || !product || !serialNorm || !txHash) return;
    if (tokenIdOnChain === undefined || tokenIdOnChain === BigInt(0)) return;

    const tokenId = Number(tokenIdOnChain);
    const now = Date.now();
    const saved = savePassportFromChain(
      address,
      product,
      serialNorm,
      tokenId,
      txHash,
      now,
      now + product.warrantyDays * 86400000
    );
    setPassport(saved);
    resetWrite();
  }, [
    isConfirmed,
    address,
    product,
    serialNorm,
    txHash,
    tokenIdOnChain,
    resetWrite,
  ]);

  useEffect(() => {
    if (writeError) setError(writeError.message.split("\n")[0]);
  }, [writeError]);

  function validateCodeStep(): boolean {
    const productMatch = warrantyCatalog.find(
      (p) => p.claimCode === claimCode.trim().toUpperCase()
    );
    if (!productMatch) {
      setError(
        "Invalid registration code. Check the card in your product box or receipt."
      );
      return false;
    }
    setError(null);
    return true;
  }

  function validateSerialStep(): boolean {
    const check = validatePassportRegistration(claimCode, serial);
    if (!check.ok) {
      setError(check.error);
      return false;
    }
    setError(null);
    return true;
  }

  function goNext() {
    if (step === 1 && validateCodeStep()) setStep(2);
    else if (step === 2 && validateSerialStep()) setStep(3);
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleRegister() {
    if (!address) return;
    setError(null);

    const check = validatePassportRegistration(claimCode, serial);
    if (!check.ok) {
      setError(check.error);
      return;
    }

    if (onChain) {
      writeContract({
        address: warrantyContracts.warrantyRedemption,
        abi: warrantyRedemptionAbi,
        functionName: "redeem",
        args: [
          claimCodeHash(claimCode),
          check.serial,
          `ipfs://vericover/passport/${check.serial}`,
        ],
      });
      return;
    }

    await new Promise((r) => setTimeout(r, 900));
    const result = registerPassport(address, claimCode, serial);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPassport(result.passport);
  }

  const loading = isWriting || isConfirming;
  const previewProduct = warrantyCatalog.find(
    (p) => p.claimCode === claimCode.trim().toUpperCase()
  );

  if (passport) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-2xl border border-emerald-400/30 bg-[#131f35] p-8 text-center">
          <div className="mb-4 text-4xl">✓</div>
          <h2 className="text-xl font-semibold text-emerald-300">Product registered!</h2>
          <p className="mt-2 text-slate-400">
            {passport.productName} — {formatWarrantyId(passport.tokenId)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Coverage active until {new Date(passport.warrantyEnd).toLocaleDateString()}
          </p>
          {onChain && (
            <details className="mt-3 text-left">
              <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-400">
                Verification details
              </summary>
              <a
                href={`https://sepolia.basescan.org/tx/${passport.mintTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-emerald-400/80 hover:underline"
              >
                View permanent registration record →
              </a>
            </details>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LinkButton href="/app/warranties" className="bg-emerald-400 text-[#060b14]">
              My products
            </LinkButton>
            <Button
              type="button"
              variant="outline"
              className="border-white/15 text-white"
              onClick={() => {
                setPassport(null);
                setClaimCode("");
                setSerial("");
                setStep(1);
              }}
            >
              Register another
            </Button>
          </div>
        </div>

        <WhatHappensNext
          steps={[
            {
              title: "Registration saved",
              description: `Your ${passport.productName} is on file with warranty ID ${formatWarrantyId(passport.tokenId)}.`,
              status: "complete",
            },
            {
              title: "Coverage is active",
              description: `Protection runs through ${new Date(passport.warrantyEnd).toLocaleDateString()}. Keep your serial number handy.`,
              status: "complete",
            },
            {
              title: "Use your product normally",
              description:
                "No action needed. Your protection plan works like any extended warranty you've used before.",
              status: "current",
            },
            {
              title: "File a claim if something breaks",
              description:
                "Go to My Products → File a claim. Choose repair, replacement, or refund — the manufacturer reviews your request.",
              status: "upcoming",
            },
          ]}
        />
      </div>
    );
  }

  return (
    <WalletGate>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Register your product</h1>
          <p className="mt-1 text-slate-400">
            Three quick steps — same as registering with SquareTrade or Assurion.
          </p>
        </div>

        <FlowStepper steps={REGISTER_STEPS} currentStep={loading ? 3 : step} />

        <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-200">Step 1 of 3</p>
                <p className="mt-1 text-sm text-slate-400">
                  Find the registration code on your product box, receipt, or welcome card.
                </p>
              </div>
              <div>
                <label htmlFor="claim-code" className="mb-2 block text-sm text-slate-300">
                  Registration code
                </label>
                <input
                  id="claim-code"
                  type="text"
                  value={claimCode}
                  onChange={(e) => {
                    setClaimCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder="VERI-LAPTOP-2026-A1"
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
              {previewProduct && (
                <p className="text-sm text-emerald-300/90">
                  ✓ Matches {previewProduct.name} by {previewProduct.manufacturer}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-200">Step 2 of 3</p>
                <p className="mt-1 text-sm text-slate-400">
                  Enter the serial number printed on your device label or settings screen.
                </p>
              </div>
              <div>
                <label htmlFor="serial" className="mb-2 block text-sm text-slate-300">
                  Serial number
                </label>
                <input
                  id="serial"
                  type="text"
                  value={serial}
                  onChange={(e) => {
                    setSerial(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  placeholder={
                    previewProduct
                      ? `${previewProduct.serialPrefix}-2026-0001842`
                      : "NT-LAP-2026-0001842"
                  }
                  className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && product && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-200">Step 3 of 3 — Review</p>
                <p className="mt-1 text-sm text-slate-400">
                  Confirm your details before activating coverage.
                </p>
              </div>
              <dl className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                <ReviewRow label="Product" value={product.name} />
                <ReviewRow label="Manufacturer" value={product.manufacturer} />
                <ReviewRow label="Registration code" value={claimCode.trim().toUpperCase()} mono />
                <ReviewRow label="Serial number" value={serialNorm} mono />
                <ReviewRow
                  label="Coverage period"
                  value={`${product.warrantyDays} days from registration`}
                />
              </dl>
              <p className="text-xs text-slate-500">
                You may be asked to approve in your wallet app — this saves your registration
                permanently, like submitting a form to SquareTrade.
              </p>
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
            {step < 3 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={step === 1 ? !claimCode.trim() : !serial.trim()}
                className="flex-1 bg-emerald-400 text-[#060b14] hover:bg-emerald-300 sm:flex-none"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 bg-emerald-400 py-3 text-base font-semibold text-[#060b14] hover:bg-emerald-300 sm:flex-none"
              >
                {loading
                  ? isConfirming
                    ? "Saving your registration…"
                    : "Approve in your wallet app…"
                  : "Register product"}
              </Button>
            )}
          </div>
        </div>

        {step < 3 && (
          <WhatHappensNext
            steps={[
              {
                title: "Enter your registration code",
                description: "Found on your product box or purchase receipt.",
                status: step > 1 ? "complete" : "current",
              },
              {
                title: "Add your serial number",
                description: "Links coverage to your specific device.",
                status: step > 2 ? "complete" : step === 2 ? "current" : "upcoming",
              },
              {
                title: "Confirm and activate",
                description: "Your protection plan goes live — view it anytime in My Products.",
                status: "upcoming",
              },
            ]}
          />
        )}

        <div className="rounded-xl border border-white/10 bg-black/20 p-5">
          <h2 className="text-sm font-semibold text-slate-300">Demo registration codes (testnet)</h2>
          <ul className="mt-3 space-y-2 text-xs text-slate-500">
            {warrantyCatalog.map((p) => (
              <li key={p.sku}>
                <button
                  type="button"
                  onClick={() => {
                    setClaimCode(p.claimCode);
                    setError(null);
                    setStep(1);
                  }}
                  className="text-left hover:text-slate-300"
                >
                  <span className="font-mono text-emerald-400/90">{p.claimCode}</span>
                  <span> → {p.name}</span>
                  <span className="text-slate-600">
                    {" "}
                    (serial e.g. {p.serialPrefix}-2026-0001842)
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
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