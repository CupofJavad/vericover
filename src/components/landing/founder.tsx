import { LinkButton } from "@/components/ui/link-button";
import { siteConfig } from "@/lib/site";

export function FounderSection() {
  return (
    <section id="founder" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#131f35] to-[#0d1526] p-8 md:p-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-300">
                Founder
              </p>
              <h2
                className="mb-4 text-3xl text-white md:text-4xl"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Built by {siteConfig.founder.name}
              </h2>
              <p className="mb-4 text-slate-300">
                I&apos;m building VeriCover because the financial layer of
                insurance — premiums, reserves, claims, and audit trails — should
                be transparent, immutable, and verifiable by anyone. No opaque
                ledgers. No black-box fund management.
              </p>
              <p className="text-sm text-slate-400">
                VeriCover is a decentralized parametric risk-sharing protocol on
                Base. Follow the build, LP opportunities, and launch updates on X.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <LinkButton
                href={siteConfig.founder.xUrl}
                external
                size="lg"
                className="bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
              >
                Follow {siteConfig.founder.handle}
              </LinkButton>
              <LinkButton
                href="mailto:hello@vericover.xyz?subject=LP%20Inquiry"
                external
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                LP partnership inquiry
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}