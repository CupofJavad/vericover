import { Badge } from "@/components/ui/badge";
import { transparencyProof } from "@/lib/site";

export function TransparencySection() {
  return (
    <section id="transparency" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <Badge className="mb-4 border-teal-400/20 bg-teal-400/10 text-teal-200 hover:bg-teal-400/10">
            Core differentiator
          </Badge>
          <h2
            className="mb-4 text-3xl text-white md:text-4xl"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Verify everything. Trust nothing.
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            VeriCover&apos;s edge is full lifecycle transparency. Every policy,
            premium, pool state change, and payout is on-chain and independently
            verifiable — without relying on this website.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {transparencyProof.map((item, i) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#131f35] p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/10 text-sm font-bold text-teal-300">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-white">{item.label}</h3>
              </div>
              <p className="text-sm text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}