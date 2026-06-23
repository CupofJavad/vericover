"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
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
  type ProductPassport,
} from "@/lib/warranties";

export default function RegisterWarrantyPage() {
  const { address } = useAccount();
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

  if (passport) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-400/30 bg-[#131f35] p-8 text-center">
        <div className="mb-4 text-4xl">✓</div>
        <h2 className="text-xl font-semibold text-emerald-300">Product registered!</h2>
        <p className="mt-2 text-slate-400">
          {passport.productName} — Warranty ID WR-{passport.tokenId}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Coverage active until {new Date(passport.warrantyEnd).toLocaleDateString()}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          What happens next: keep your serial number handy. If something breaks, file a
          claim from My Products — the manufacturer will review your request.
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
            }}
          >
            Register another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <WalletGate>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Register your product</h1>
          <p className="mt-1 text-slate-400">
            Enter the registration code from your product box or receipt, plus the serial
            number on the device label. This activates your protection plan — like
            registering with SquareTrade or Assurion.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6 space-y-5">
          <div>
            <label htmlFor="claim-code" className="mb-2 block text-sm text-slate-300">
              Registration code
            </label>
            <input
              id="claim-code"
              type="text"
              value={claimCode}
              onChange={(e) => setClaimCode(e.target.value.toUpperCase())}
              placeholder="VERI-LAPTOP-2026-A1"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="serial" className="mb-2 block text-sm text-slate-300">
              Serial number
            </label>
            <input
              id="serial"
              type="text"
              value={serial}
              onChange={(e) => setSerial(e.target.value.toUpperCase())}
              placeholder="NT-LAP-2026-0001842"
              className="w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder:text-slate-600 focus:border-emerald-400/50 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button
            onClick={handleRegister}
            disabled={!claimCode.trim() || !serial.trim() || loading}
            className="w-full bg-emerald-400 py-6 text-base font-semibold text-[#060b14] hover:bg-emerald-300"
          >
            {loading
              ? isConfirming
                ? "Saving your registration…"
                : "Approve in your wallet app…"
              : "Register product"}
          </Button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-5">
          <h2 className="text-sm font-semibold text-slate-300">Demo registration codes (testnet)</h2>
          <ul className="mt-3 space-y-2 text-xs text-slate-500">
            {warrantyCatalog.map((p) => (
              <li key={p.sku} className="flex flex-wrap gap-2">
                <span className="font-mono text-emerald-400/90">{p.claimCode}</span>
                <span>→ {p.name}</span>
                <span className="text-slate-600">
                  (e.g. {p.serialPrefix}-2026-0001842)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WalletGate>
  );
}