import { ShieldIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-200">
            Regulatory disclaimer
          </p>
          <p className="text-sm leading-relaxed text-amber-100/80">
            VeriCover demonstrates blockchain advantages for policy issuance,
            premium collection, reserve management, and immutable audit trails. It
            does <strong>not</strong> constitute a licensed insurance product.
            Licensed insurance requires regulated entities, jurisdictional
            approvals, KYC/AML, and compliance infrastructure. This protocol is
            a decentralized parametric risk-sharing system focused on on-chain
            financial primitives.
          </p>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4 text-teal-400" />
            <span>
              {siteConfig.name} · Founded by {siteConfig.founder.name} ·{" "}
              {siteConfig.founder.handle}
            </span>
          </div>
          <p>© {new Date().getFullYear()} {siteConfig.founder.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}