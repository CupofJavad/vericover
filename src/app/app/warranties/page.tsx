"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import {
  getPassports,
  getClaims,
  claimStatusLabels,
  formatWarrantyId,
  type ProductPassport,
  type WarrantyClaim,
} from "@/lib/warranties";

const passportStatusLabels: Record<ProductPassport["status"], string> = {
  active: "Active coverage",
  expired: "Expired",
  claimed: "Claim in progress",
};

const passportStatusColors: Record<ProductPassport["status"], string> = {
  active: "border-emerald-400/30 text-emerald-300",
  expired: "border-slate-500/30 text-slate-400",
  claimed: "border-blue-400/30 text-blue-300",
};

const claimStatusColors: Record<WarrantyClaim["status"], string> = {
  submitted: "border-amber-400/30 text-amber-300",
  under_review: "border-blue-400/30 text-blue-300",
  approved: "border-emerald-400/30 text-emerald-300",
  rejected: "border-red-400/30 text-red-300",
  paid: "border-teal-400/30 text-teal-300",
};

export default function WarrantiesPage() {
  const { address } = useAccount();
  const [passports, setPassports] = useState<ProductPassport[]>([]);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);

  useEffect(() => {
    if (address) {
      setPassports(getPassports(address));
      setClaims(getClaims(address));
    }
  }, [address]);

  const active = passports.filter((p) => p.status === "active");

  return (
    <WalletGate>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">My Products</h1>
            <p className="mt-1 max-w-xl text-slate-400">
              Register electronics with your registration code, view coverage dates, and
              file repair, replacement, or refund requests — backed by your manufacturer.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton
              href="/app/warranties/register"
              className="bg-emerald-400 text-[#060b14] hover:bg-emerald-300"
            >
              Register product
            </LinkButton>
            <LinkButton
              href="/app/warranties/claim"
              variant="outline"
              className="border-white/15 text-white"
            >
              File a claim
            </LinkButton>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Active coverage" value={String(active.length)} />
          <Stat label="Registered products" value={String(passports.length)} />
          <Stat
            label="Open claims"
            value={String(
              claims.filter((c) => c.status !== "paid" && c.status !== "rejected").length
            )}
          />
        </div>

        <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-100/80">
          Product protection by Javad — manufacturer-backed service plans. This is not
          licensed insurance; coverage terms come from your product&apos;s protection plan.
        </p>

        {passports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <p className="text-4xl" aria-hidden>
              📦
            </p>
            <p className="mt-4 text-slate-400">No registered products yet.</p>
            <p className="mt-2 text-sm text-slate-500">
              Find the registration code on your product box or receipt, then enter it
              with your serial number to activate coverage.
            </p>
            <LinkButton
              href="/app/warranties/register"
              className="mt-6 bg-emerald-400 text-[#060b14]"
            >
              Register your first product
            </LinkButton>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {passports.map((p) => (
              <article
                key={p.id}
                className="card-shine rounded-2xl border border-white/10 bg-[#131f35] p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Warranty ID:{" "}
                    <span className="font-medium text-slate-200">
                      {formatWarrantyId(p.tokenId)}
                    </span>
                  </span>
                  <Badge variant="outline" className={passportStatusColors[p.status]}>
                    {passportStatusLabels[p.status]}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold">{p.productName}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Covered by {p.manufacturer}
                </p>
                <dl className="mt-4 space-y-2 text-sm">
                  <Row label="Serial number" value={p.serialNumber} mono />
                  <Row
                    label="Coverage ends"
                    value={new Date(p.warrantyEnd).toLocaleDateString()}
                  />
                </dl>
                <details className="mt-4">
                  <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-400">
                    Verification details
                  </summary>
                  <a
                    href={`https://sepolia.basescan.org/tx/${p.mintTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-emerald-400/80 hover:underline"
                  >
                    View permanent registration record →
                  </a>
                </details>
              </article>
            ))}
          </div>
        )}

        {claims.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Recent claims</h2>
            <div className="space-y-3">
              {claims.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#131f35] px-4 py-3 text-sm"
                >
                  <div>
                    <span className="font-medium">{c.productName}</span>
                    <span className="ml-2 text-slate-500">· {c.claimType}</span>
                  </div>
                  <Badge variant="outline" className={claimStatusColors[c.status]}>
                    {claimStatusLabels[c.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </WalletGate>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#131f35] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Row({
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
      <dd className={mono ? "font-mono text-xs text-slate-300" : "text-slate-200"}>
        {value}
      </dd>
    </div>
  );
}