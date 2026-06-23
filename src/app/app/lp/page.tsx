"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { WalletGate } from "@/components/app/wallet-gate";
import { Button } from "@/components/ui/button";
import { getLpPosition, saveLpPosition } from "@/lib/policies";
import { lpEconomics } from "@/lib/site";

export default function LpPage() {
  const { address } = useAccount();
  const [amount, setAmount] = useState(1000);
  const [position, setPosition] = useState<ReturnType<typeof getLpPosition>>(null);
  const [staking, setStaking] = useState(false);

  useEffect(() => {
    if (address) setPosition(getLpPosition(address));
  }, [address]);

  async function handleStake() {
    if (!address) return;
    setStaking(true);
    await new Promise((r) => setTimeout(r, 1000));
    const existing = getLpPosition(address);
    const next = {
      staked: (existing?.staked ?? 0) + amount,
      stakedAt: Date.now(),
      earnings: (existing?.earnings ?? 0) + amount * 0.002,
    };
    saveLpPosition(address, next);
    setPosition(next);
    setStaking(false);
  }

  const utilization = 68;
  const solvency = 124;
  const estApy = "8.4%";

  return (
    <WalletGate>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">LP Staking</h1>
          <p className="mt-1 text-slate-400">
            Stake USDC to back parametric cover and earn premium yield
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <PoolStat label="Pool utilization" value={`${utilization}%`} />
          <PoolStat label="Est. APY" value={estApy} highlight />
          <PoolStat label="Solvency ratio" value={`${solvency}%`} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
            <h2 className="mb-4 text-lg font-semibold">Stake USDC</h2>
            <p className="mb-4 text-sm text-slate-400">
              {lpEconomics.lpShare} of premiums flow to LPs · {lpEconomics.minLockDays}
              -day minimum lock · Capital at risk when claims pay out
            </p>
            <label className="mb-2 block text-sm text-slate-300">
              Amount: ${amount.toLocaleString()} USDC
            </label>
            <input
              type="range"
              min={100}
              max={50000}
              step={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mb-4 w-full accent-teal-400"
            />
            <Button
              onClick={handleStake}
              disabled={staking}
              className="w-full bg-teal-400 py-5 text-base font-semibold text-[#060b14] hover:bg-teal-300"
            >
              {staking ? "Staking…" : `Stake $${amount.toLocaleString()} USDC`}
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
            <h2 className="mb-4 text-lg font-semibold">Your position</h2>
            {position ? (
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs text-slate-500">Total staked</dt>
                  <dd className="text-3xl font-bold text-white">
                    ${position.staked.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Est. earnings (demo)</dt>
                  <dd className="text-xl text-teal-300">
                    ${position.earnings.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Staked since</dt>
                  <dd className="text-sm text-slate-300">
                    {new Date(position.stakedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-slate-400">
                No LP position yet. Stake USDC to start earning premium share.
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Pool metrics are illustrative on testnet beta. Full on-chain ReservePool
          contract integration is the next deployment milestone.
        </p>
      </div>
    </WalletGate>
  );
}

function PoolStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#131f35] p-4 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${highlight ? "text-teal-300" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}