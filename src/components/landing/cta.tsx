import { LinkButton } from "@/components/ui/link-button";
import { ArrowRightIcon } from "@/components/icons";

export function CtaSection() {
  return (
    <section id="cta" className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2
          className="mb-4 text-3xl text-white md:text-5xl"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Ready to cover or provide capital?
        </h2>
        <p className="mb-8 text-slate-400">
          Connect your wallet to purchase parametric cover or stake USDC as an LP.
          Early access opens on Base Sepolia — mainnet follows audit prep.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <LinkButton
            href="/app"
            size="lg"
            className="inline-flex items-center gap-2 bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
          >
            Launch App
            <ArrowRightIcon />
          </LinkButton>
          <LinkButton
            href="/app/lp"
            size="lg"
            variant="outline"
            className="border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            Become an LP
          </LinkButton>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Live on Base Sepolia testnet. Follow{" "}
          <a
            href="https://x.com/Zarathustra_F"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-300 hover:underline"
          >
            @Zarathustra_F
          </a>{" "}
          for early LP allocation.
        </p>
      </div>
    </section>
  );
}