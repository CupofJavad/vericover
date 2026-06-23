import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lpEconomics } from "@/lib/site";

const benefits = [
  "Earn a share of every premium collected in the pool",
  "ERC-4626 vault shares — composable, transparent ownership",
  "Real-time utilization, solvency ratio, and estimated APY",
  "Capital backs real parametric protection — not synthetic yield",
];

export function LpSection() {
  return (
    <section id="lp" className="border-y border-white/10 bg-[#0d1526]/60 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="mb-4 border-teal-400/20 bg-teal-400/10 text-teal-200 hover:bg-teal-400/10">
              For capital providers
            </Badge>
            <h2
              className="mb-4 text-3xl text-white md:text-4xl"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Become an LP. Earn real yield from real premiums.
            </h2>
            <p className="max-w-2xl text-slate-400">
              Stake USDC into the VeriCover ReservePool and earn a direct share
              of policy premiums while backing automated parametric protection.
              Pool health, utilization, and solvency are visible on-chain — no
              black box.
            </p>
          </div>
          <LinkButton
            href="#cta"
            external
            size="lg"
            className="w-fit bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
          >
            Stake USDC — Become an LP
          </LinkButton>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-white/10 bg-[#131f35] text-white lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">LP economics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-slate-400">LP premium share</p>
                  <p className="text-3xl font-bold text-teal-300">
                    {lpEconomics.lpShare}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-slate-400">Protocol fee</p>
                  <p className="text-3xl font-bold">{lpEconomics.protocolFee}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-slate-400">Risk buffer</p>
                  <p className="text-3xl font-bold">{lpEconomics.riskBuffer}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#131f35] text-white">
            <CardHeader>
              <CardTitle className="text-xl">Who this is for</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300">
              <p>
                <strong className="text-white">Yield-focused LPs</strong> seeking
                premium-backed returns beyond vanilla DeFi lending.
              </p>
              <p>
                <strong className="text-white">DAO treasuries</strong> deploying
                stablecoin capital into transparent, auditable risk pools.
              </p>
              <p>
                <strong className="text-white">Base ecosystem funds</strong>{" "}
                aligned with on-chain cover infrastructure.
              </p>
              <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-100/90">
                Minimum {lpEconomics.minLockDays}-day lock applies. Withdrawals
                respect MCR solvency gates. Capital is at risk when claims pay
                out.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}