"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
import { Badge } from "@/components/ui/badge";
import { getPolicies, type Policy } from "@/lib/policies";
import { LinkButton } from "@/components/ui/link-button";

const statusColors: Record<Policy["status"], string> = {
  active: "border-teal-400/30 text-teal-300",
  claimed: "border-blue-400/30 text-blue-300",
  expired: "border-slate-500/30 text-slate-400",
};

export default function PoliciesPage() {
  const { address } = useAccount();
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    if (address) setPolicies(getPolicies(address));
  }, [address]);

  return (
    <WalletGate>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">My Policies</h1>
            <p className="mt-1 text-slate-400">
              Immutable policy certificates — verify on Basescan at mainnet launch
            </p>
          </div>
          <LinkButton href="/app/buy" className="bg-teal-400 text-[#060b14]">
            Buy Cover
          </LinkButton>
        </div>

        {policies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <p className="text-slate-400">No policies yet.</p>
            <LinkButton href="/app/buy" className="mt-4 bg-teal-400 text-[#060b14]">
              Browse products
            </LinkButton>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {policies.map((p) => (
              <article
                key={p.id}
                className="card-shine rounded-2xl border border-white/10 bg-[#131f35] p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-400">
                    Policy NFT #{p.tokenId}
                  </span>
                  <Badge variant="outline" className={statusColors[p.status]}>
                    {p.status}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold">{p.productName}</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <Row label="Coverage" value={`$${p.coverage.toLocaleString()} USDC`} />
                  <Row label="Premium paid" value={`$${p.premium.toFixed(2)} USDC`} />
                  <Row label="Duration" value={`${p.days} days`} />
                  <Row
                    label="Expires"
                    value={new Date(p.expiresAt).toLocaleDateString()}
                  />
                  <Row label="Beneficiary" value={truncate(p.beneficiary)} />
                  <Row label="Tx hash" value={truncate(p.txHash)} mono />
                </dl>
                <a
                  href={`https://sepolia.basescan.org/tx/${p.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-xs text-teal-400 hover:underline"
                >
                  View on Basescan →
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </WalletGate>
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

function truncate(s: string) {
  return `${s.slice(0, 8)}…${s.slice(-6)}`;
}