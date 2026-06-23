import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowRightIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060b14] via-[#060b14]/92 to-[#060b14]/70" />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-16 lg:flex-row lg:items-center lg:pt-24">
        <div className="flex-1">
          <Badge className="mb-6 border-teal-400/20 bg-teal-400/10 text-teal-200 hover:bg-teal-400/10">
            Built on {siteConfig.chain} · Founded by {siteConfig.founder.name}
          </Badge>
          <h1
            className="mb-6 text-4xl leading-[1.08] tracking-tight text-white md:text-6xl"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            {siteConfig.tagline}
          </h1>
          <p className="mb-4 max-w-xl text-lg leading-relaxed text-slate-300">
            VeriCover replaces the financial layer of insurance with immutable
            policy NFTs, a transparent USDC reserve pool, and automated parametric
            claims — every step verifiable on-chain.
          </p>
          <p className="mb-8 text-sm text-slate-400">
            A decentralized parametric risk-sharing protocol. Not licensed
            insurance — real on-chain financial primitives for cover buyers and
            capital providers.
          </p>
          <div className="flex flex-wrap gap-4">
            <LinkButton
              href="#cta"
              external
              size="lg"
              className="inline-flex items-center gap-2 bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
            >
              Connect Wallet
              <ArrowRightIcon />
            </LinkButton>
            <LinkButton
              href="#lp"
              external
              size="lg"
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              Become an LP — Earn Yield
            </LinkButton>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Follow the build:{" "}
            <a
              href={siteConfig.founder.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-300 hover:underline"
            >
              {siteConfig.founder.handle}
            </a>
          </p>
        </div>

        <div className="flex flex-1 justify-center lg:justify-end">
          <div className="card-shine w-full max-w-md rounded-2xl border border-white/10 bg-[#131f35]/90 p-6 shadow-2xl shadow-teal-500/10 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Live pool metrics
              </span>
              <Badge variant="outline" className="border-teal-400/30 text-teal-300">
                Early access
              </Badge>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Target LP APY</p>
                <p className="text-2xl font-bold text-teal-300">6–12%</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Premium to LPs</p>
                <p className="text-2xl font-bold text-white">73%</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Settlement</p>
                <p className="text-2xl font-bold text-white">&lt;1 block</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-400">Audit trail</p>
                <p className="text-2xl font-bold text-white">100%</p>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500">
              Metrics update on-chain at mainnet launch · Verify on Basescan
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}