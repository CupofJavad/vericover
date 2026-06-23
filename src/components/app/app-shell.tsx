"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/wallet/connect-button";
import { ChainBanner } from "@/components/app/chain-banner";
import { ShieldIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/app", label: "Dashboard", exact: true },
  { href: "/app/buy", label: "Buy Cover" },
  { href: "/app/policies", label: "My Policies" },
  { href: "/app/warranties", label: "Warranties" },
  { href: "/app/lp", label: "LP Staking" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
              <ShieldIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-semibold">{siteConfig.name}</span>
              <span className="block text-[10px] text-slate-500">by {siteConfig.founder.name}</span>
            </div>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {nav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-teal-400/10 text-teal-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ConnectButton />
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 md:hidden">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs ${
                  active ? "bg-teal-400/10 text-teal-300" : "text-slate-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <ChainBanner />
        {children}
      </main>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        Base Sepolia testnet · Founded by {siteConfig.founder.name} ·{" "}
        <Link href="/how-it-works" className="text-teal-400 hover:underline">
          Simple guide
        </Link>
      </footer>
    </div>
  );
}