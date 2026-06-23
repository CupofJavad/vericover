import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const insuranceProducts = [
  {
    name: "Stablecoin Depeg Cover",
    tag: "DeFi",
    description:
      "Automatic payout when USDC or USDT trades below $0.995 for 24 hours. Chainlink feed + confirmation window — the lowest-risk parametric product to launch first.",
    trigger: "Price < $0.995 sustained → payout",
    premium: "From ~0.5% / 90 days",
  },
  {
    name: "Flight Delay Cover",
    tag: "Travel",
    description:
      "Parametric payouts for delays or cancellations — verified via aviation data oracles. No claims adjusters, no paperwork.",
    trigger: "30m · 60m · 120m tiers + cancellation",
    premium: "From ~2% / trip",
  },
  {
    name: "DeFi Exploit Cover",
    tag: "Crypto",
    description:
      "Protection against smart contract exploits with multi-signal on-chain monitoring and rule-based payouts. Hybrid confirmation for attribution safety.",
    trigger: "Multi-signal + confirmation window",
    premium: "Custom per protocol",
  },
];

const warrantyProduct = {
  name: "Digital Product Warranties",
  tag: "Physical goods",
  description:
    "Register electronics with a claim code to mint a Product Passport NFT. File repair, replacement, or refund claims — funded by manufacturer tranches, isolated from parametric LP pools.",
  trigger: "Claim code + serial → passport mint",
  premium: "Included with product / manufacturer-backed",
};

export function ProductsSection() {
  return (
    <section id="products" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <Badge className="mb-4 border-teal-400/20 bg-teal-400/10 text-teal-200 hover:bg-teal-400/10">
            Parametric products
          </Badge>
          <h2
            className="mb-4 text-3xl text-white md:text-4xl"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Cover that pays itself
          </h2>
          <p className="max-w-2xl text-slate-400">
            Parametric insurance products plus a separate warranty rail for physical
            goods. Policies and passports are immutable ERC-721 NFTs — verify on Basescan.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {insuranceProducts.map((p) => (
            <Card
              key={p.name}
              className="border-white/10 bg-[#131f35] text-white transition hover:border-teal-400/20"
            >
              <CardHeader>
                <Badge
                  variant="outline"
                  className="mb-2 w-fit border-teal-400/30 text-teal-300"
                >
                  {p.tag}
                </Badge>
                <CardTitle>{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">{p.description}</p>
                <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm">
                  <p className="text-xs text-slate-500">Trigger</p>
                  <p>{p.trigger}</p>
                </div>
                <p className="text-xs text-slate-500">Indicative premium: {p.premium}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="border-emerald-400/20 bg-[#131f35] text-white transition hover:border-emerald-400/30">
            <CardHeader>
              <Badge
                variant="outline"
                className="mb-2 w-fit border-emerald-400/30 text-emerald-300"
              >
                {warrantyProduct.tag}
              </Badge>
              <CardTitle>{warrantyProduct.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-400">{warrantyProduct.description}</p>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm">
                <p className="text-xs text-slate-500">Registration</p>
                <p>{warrantyProduct.trigger}</p>
              </div>
              <p className="text-xs text-slate-500">
                Coverage model: {warrantyProduct.premium}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}