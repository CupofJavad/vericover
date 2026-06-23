"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  registerPassport,
  warrantyCatalog,
  type ProductPassport,
} from "@/lib/warranties";

export default function RegisterWarrantyPage() {
  const { address } = useAccount();
  const [claimCode, setClaimCode] = useState("");
  const [serial, setSerial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passport, setPassport] = useState<ProductPassport | null>(null);

  async function handleRegister() {
    if (!address) return;
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 900));
    const result = registerPassport(address, claimCode, serial);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setPassport(result.passport);
    setLoading(false);
  }

  if (passport) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-400/30 bg-[#131f35] p-8 text-center">
        <div className="mb-4 text-4xl">✓</div>
        <h2 className="text-xl font-semibold text-emerald-300">Passport minted!</h2>
        <p className="mt-2 text-slate-400">
          Product Passport #{passport.tokenId} — {passport.productName}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Warranty active until {new Date(passport.warrantyEnd).toLocaleDateString()}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton
            href="/app/warranties"
            className="bg-emerald-400 text-[#060b14]"
          >
            My passports
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
            Enter the claim code from your product packaging and the serial number on the
            device label. This mints your digital product passport.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6 space-y-5">
          <div>
            <label htmlFor="claim-code" className="mb-2 block text-sm text-slate-300">
              Claim code
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
            {loading ? "Minting passport…" : "Mint Product Passport NFT"}
          </Button>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-5">
          <h2 className="text-sm font-semibold text-slate-300">Demo claim codes (testnet)</h2>
          <ul className="mt-3 space-y-2 text-xs text-slate-500">
            {warrantyCatalog.map((p) => (
              <li key={p.sku} className="flex flex-wrap gap-2">
                <span className="font-mono text-emerald-400/90">{p.claimCode}</span>
                <span>→ {p.name}</span>
                <span className="text-slate-600">(serial: {p.serialPrefix}-…)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WalletGate>
  );
}