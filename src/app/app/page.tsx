"use client";

import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { WalletGate } from "@/components/app/wallet-gate";
import { LinkButton } from "@/components/ui/link-button";
import { USDC_BASE_SEPOLIA, erc20Abi } from "@/lib/wagmi";
import { getPolicies, getLpPosition } from "@/lib/policies";
import { getPassports } from "@/lib/warranties";
import { useEffect, useState } from "react";
import type { Policy } from "@/lib/policies";
import type { LpPosition } from "@/lib/policies";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [lp, setLp] = useState<LpPosition | null>(null);
  const [passportCount, setPassportCount] = useState(0);

  const { data: usdcBalance } = useReadContract({
    address: USDC_BASE_SEPOLIA,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    if (address) {
      setPolicies(getPolicies(address));
      setLp(getLpPosition(address));
      setPassportCount(getPassports(address).filter((p) => p.status === "active").length);
    }
  }, [address]);

  const activePolicies = policies.filter((p) => p.status === "active");
  const usdc =
    usdcBalance !== undefined
      ? Number(formatUnits(usdcBalance, 6)).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
      : "—";

  return (
    <WalletGate>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-slate-400">
            Your VeriCover overview on Base Sepolia testnet
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="USDC Balance" value={`$${usdc}`} sub="Wallet on Base Sepolia" />
          <StatCard
            label="Active Policies"
            value={String(activePolicies.length)}
            sub={`${policies.length} total`}
          />
          <StatCard
            label="Registered Products"
            value={String(passportCount)}
            sub="Active protection plans"
          />
          <StatCard
            label="LP Staked"
            value={lp ? `$${lp.staked.toLocaleString()}` : "$0"}
            sub={lp ? `Est. earnings $${lp.earnings.toFixed(2)}` : "Not staking"}
          />
          <StatCard label="Network" value="Base Sepolia" sub="Testnet" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
            <h2 className="mb-4 text-lg font-semibold">Quick actions</h2>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/app/buy" className="bg-teal-400 text-[#060b14] hover:bg-teal-300">
                Buy Cover
              </LinkButton>
              <LinkButton href="/app/lp" variant="outline" className="border-white/15 text-white">
                Stake as LP
              </LinkButton>
              <LinkButton href="/app/policies" variant="outline" className="border-white/15 text-white">
                My Policies
              </LinkButton>
              <LinkButton href="/app/warranties" variant="outline" className="border-white/15 text-white">
                My Products
              </LinkButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent policies</h2>
            {policies.length === 0 ? (
              <p className="text-sm text-slate-400">
                No policies yet.{" "}
                <Link href="/app/buy" className="text-teal-400 hover:underline">
                  Buy your first cover →
                </Link>
              </p>
            ) : (
              <ul className="space-y-3">
                {policies.slice(0, 3).map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
                  >
                    <span>
                      #{p.tokenId} {p.productName}
                    </span>
                    <span className="text-teal-300">${p.coverage.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {isConnected && (
          <p className="text-center text-xs text-slate-500">
            Policies and LP positions are recorded locally for this testnet beta.
            On-chain contract integration ships next. Verify wallet USDC balance
            on{" "}
            <a
              href="https://sepolia.basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              Basescan
            </a>
            .
          </p>
        )}
      </div>
    </WalletGate>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#131f35] p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
  );
}