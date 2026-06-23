import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Footer } from "@/components/landing/footer";
import { FlowDiagram } from "@/components/how-it-works/flow-diagram";
import { BeforeAfter } from "@/components/how-it-works/before-after";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { siteConfig, lpEconomics } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works — Simple Guide",
  description:
    "A beginner-friendly guide to VeriCover: automatic protection, transparent pools, and real-world uses. Built by Javad.",
};

const useCases = [
  {
    emoji: "🔐",
    title: "Protect your crypto from hacks",
    who: "Anyone holding funds in DeFi apps or exchanges",
    story:
      "Alex keeps $10,000 in a lending app. He buys VeriCover exploit protection for $50. If a known hack trigger fires, he receives a payout automatically — no claim forms.",
    benefit: "Faster payout, clear rules, no waiting on a claims adjuster.",
  },
  {
    emoji: "✈️",
    title: "Flight delay or cancellation cover",
    who: "Travelers and small business owners who fly often",
    story:
      "Maria books a flight for a client meeting. Her policy pays out if the flight is delayed 60+ minutes or cancelled — verified by flight data, not her word.",
    benefit: "Peace of mind without arguing with an airline or insurer.",
  },
  {
    emoji: "🌾",
    title: "Weather protection for farmers & shops",
    who: "Farmers, outdoor venues, and seasonal businesses",
    story:
      "A coffee stand owner buys rainfall cover. If rainfall drops below the policy threshold during harvest season, they receive a payout to offset lost revenue.",
    benefit: "Parametric = payout based on weather data, not lengthy loss inspections.",
  },
  {
    emoji: "💵",
    title: "Stablecoin depeg protection",
    who: "People and businesses holding USDC or USDT",
    story:
      "Jordan holds payroll in USDC. If the coin trades below $0.995 for 24 hours, his policy triggers an automatic payout to help cover the shortfall.",
    benefit: "Protection against a rare but painful event — with rules everyone can see upfront.",
  },
  {
    emoji: "🎪",
    title: "Event-based cover",
    who: "Event organizers, freelancers, and vendors",
    story:
      "A festival vendor buys cover tied to a weather index. If extreme heat crosses the policy threshold, they get paid — helping cover extra costs or lost sales.",
    benefit: "Custom triggers mean cover can match real business risks.",
  },
  {
    emoji: "🏦",
    title: "Earn yield by backing real protection",
    who: "People with extra USDC looking for transparent returns",
    story:
      "Sam deposits USDC into the VeriCover pool. When others buy policies, Sam earns a share of premiums — while helping fund real payouts if triggers fire.",
    benefit: "Yield tied to actual insurance activity, with public pool stats.",
  },
];

const whyMatters = [
  {
    title: "Payouts can be fast",
    body: "When a trigger is met, the system pays out automatically — often in minutes, not months.",
  },
  {
    title: "Fewer middlemen for certain risks",
    body: "Parametric cover uses clear rules and data sources instead of long back-and-forth with adjusters.",
  },
  {
    title: "You can see where money goes",
    body: "Premiums flow into a public reserve pool. Anyone can check balances, payouts, and pool health.",
  },
  {
    title: "You own your policy",
    body: "Your coverage is a digital certificate (NFT) with fixed terms — like a receipt that can never be quietly changed.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/how-it-works-hero.jpg"
              alt=""
              fill
              priority
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060b14]/80 via-[#060b14]/90 to-[#060b14]" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
            <Badge className="mb-6 border-teal-400/20 bg-teal-400/10 text-teal-200 hover:bg-teal-400/10">
              Plain-English guide · Built by {siteConfig.founder.name}
            </Badge>
            <h1
              className="mb-6 text-4xl leading-tight md:text-5xl"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Protection that pays itself — explained simply
            </h1>
            <p className="mb-4 text-lg leading-relaxed text-slate-300">
              Think of {siteConfig.name} like insurance that runs on a public
              spreadsheet everyone can see. You buy cover, your terms are locked
              in, and when a real-world event happens (a flight delay, a price
              drop, a hack signal), the system pays out automatically — no
              paperwork fight.
            </p>
            <p className="text-sm text-slate-400">
              {siteConfig.name} is a decentralized parametric risk-sharing
              protocol — not traditional licensed insurance. It focuses on
              making protection faster, clearer, and verifiable.
            </p>
          </div>
        </section>

        {/* What is it */}
        <section className="border-y border-white/10 bg-[#0d1526]/50 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
              What is {siteConfig.name}?
            </h2>
            <p className="mb-4 leading-relaxed text-slate-300">
              {siteConfig.name} lets you buy digital protection against specific
              risks — like a delayed flight, a stablecoin losing its peg, or a
              DeFi hack. You pay a premium in USDC (a digital dollar). That money
              goes into a shared reserve pool that backs payouts.
            </p>
            <p className="leading-relaxed text-slate-400">
              Your policy is a digital certificate you keep in your wallet — proof
              of what you bought, when, and what triggers a payout. Everything is
              recorded publicly so anyone can verify it, like checking rows on a
              spreadsheet that nobody can secretly edit.
            </p>
          </div>
        </section>

        {/* Flow diagram */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <FlowDiagram />
          </div>
        </section>

        {/* Step by step - 4 pillars */}
        <section className="border-y border-white/10 bg-[#0d1526]/40 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2
              className="mb-12 text-center text-3xl text-white"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              How everything works
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
                <span className="text-2xl" aria-hidden>
                  🛡️
                </span>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  1. Buying protection
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Connect your wallet (like logging into a secure app). Browse
                  cover types, see your price, and pay in USDC. You immediately
                  receive a policy certificate with your coverage amount, dates,
                  and payout rules — all fixed at purchase.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
                <span className="text-2xl" aria-hidden>
                  ⚡
                </span>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  2. How claims work (parametric)
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  &quot;Parametric&quot; means payout follows clear data — not
                  opinions. If your flight is delayed 60 minutes, or USDC drops
                  below $0.995 for 24 hours, the system checks trusted data
                  sources and pays you automatically. No adjuster decides if you
                  &quot;deserve&quot; it.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
                <span className="text-2xl" aria-hidden>
                  💰
                </span>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  3. How LPs earn yield
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Liquidity Providers (LPs) deposit USDC into the reserve pool —
                  like putting money in a transparent community fund. When people
                  buy policies, {lpEconomics.lpShare} of premiums go to LPs as
                  yield. LPs take risk: if big payouts happen, the pool covers
                  them first. Pool health is visible to everyone.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6">
                <span className="text-2xl" aria-hidden>
                  🔍
                </span>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  4. Transparency & immutability
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Your policy terms cannot be quietly changed after purchase.
                  Every premium, pool update, and payout leaves a public record.
                  You do not have to trust a company&apos;s word — you can verify
                  the history yourself on a block explorer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Before / After */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2
              className="mb-8 text-center text-3xl text-white"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Why this is different
            </h2>
            <BeforeAfter />
          </div>
        </section>

        {/* Real world applications */}
        <section className="border-y border-white/10 bg-[#0d1526]/50 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2
              className="mb-4 text-center text-3xl text-white"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Real-world applications
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-slate-400">
              Six relatable examples of who uses parametric cover and why it
              helps.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {useCases.map((uc) => (
                <article
                  key={uc.title}
                  className="rounded-2xl border border-white/10 bg-[#131f35] p-6"
                >
                  <span className="text-3xl" aria-hidden>
                    {uc.emoji}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {uc.title}
                  </h3>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-teal-300/80">
                    Who benefits: {uc.who}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {uc.story}
                  </p>
                  <p className="mt-3 rounded-lg border border-teal-400/15 bg-teal-400/5 p-3 text-sm text-slate-300">
                    <strong className="text-teal-200">Why better: </strong>
                    {uc.benefit}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why matters */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2
              className="mb-10 text-center text-3xl text-white"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Why this matters for regular people
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {whyMatters.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-[#131f35]/80 p-5"
                >
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple disclaimer */}
        <section className="border-t border-white/10 bg-amber-500/5 py-10">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-sm leading-relaxed text-amber-100/80">
              <strong className="text-amber-100">Good to know: </strong>
              {siteConfig.name} demonstrates how blockchain can make protection
              clearer and faster. It is not a licensed insurance company. Real
              insurance in your country may require regulated providers. Always
              do your own research before buying cover or providing capital.
            </p>
          </div>
        </section>

        {/* CTAs */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2
              className="mb-4 text-3xl text-white"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Ready to try it?
            </h2>
            <p className="mb-8 text-slate-400">
              Whether you want protection or want to earn yield backing others,
              {siteConfig.name} is built for transparency first.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <LinkButton
                href="/#cta"
                size="lg"
                className="bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
              >
                Get Cover
              </LinkButton>
              <LinkButton
                href="/#lp"
                size="lg"
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                Become an LP
              </LinkButton>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Questions? Follow{" "}
              <Link
                href={siteConfig.founder.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-300 hover:underline"
              >
                {siteConfig.founder.handle}
              </Link>{" "}
              — founder {siteConfig.founder.name}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}