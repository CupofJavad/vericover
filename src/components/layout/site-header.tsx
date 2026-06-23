"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/link-button";
import { ShieldIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

const mainNav = [
  { href: "/how-it-works", label: "How it works", isRoute: true },
  { href: "/#products", label: "Products", isRoute: false },
  { href: "/#lp", label: "Become an LP", isRoute: false },
  { href: "/#faq", label: "FAQ", isRoute: false },
];

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";

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
          {mainNav.map((item) => {
            const isActive =
              item.isRoute && pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-white ${
                  isActive ? "text-teal-300" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LinkButton
            href={onHome ? "#lp" : "/#lp"}
            external={onHome}
            variant="outline"
            className="hidden border-white/15 bg-white/5 text-white hover:bg-white/10 sm:inline-flex"
          >
            Become an LP
          </LinkButton>
          <LinkButton
            href={onHome ? "#cta" : "/#cta"}
            external={!onHome ? false : true}
            className="bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
          >
            Get Cover
          </LinkButton>
        </div>
      </div>
    </header>
  );
}