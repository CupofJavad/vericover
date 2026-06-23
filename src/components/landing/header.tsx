import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import { ShieldIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "#products", label: "Products" },
  { href: "#lp", label: "Become an LP" },
  { href: "#transparency", label: "Transparency" },
  { href: "#faq", label: "FAQ" },
  { href: "#founder", label: "Founder" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060b14]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300 ring-1 ring-teal-400/20">
            <ShieldIcon className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-lg font-semibold tracking-tight text-white">
              {siteConfig.name}
            </span>
            <span className="block text-[11px] text-slate-400">
              by {siteConfig.founder.name}
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LinkButton
            href="#lp"
            external
            variant="outline"
            className="hidden border-white/15 bg-white/5 text-white hover:bg-white/10 sm:inline-flex"
          >
            Become an LP
          </LinkButton>
          <LinkButton
            href="#cta"
            external
            className="bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
          >
            Connect Wallet
          </LinkButton>
        </div>
      </div>
    </header>
  );
}