import {
  ArrowRightIcon,
  ChainIcon,
  ChartIcon,
  LockIcon,
  ShieldIcon,
  ZapIcon,
} from "@/components/icons";

const products = [
  {
    name: "DeFi Exploit Cover",
    tag: "Crypto",
    description:
      "Protection against smart contract exploits and protocol hacks with oracle-monitored on-chain signals and rule-based payouts.",
    trigger: "Multi-signal detection + confirmation window",
  },
  {
    name: "Flight Delay Cover",
    tag: "Travel",
    description:
      "Parametric payouts when your flight is delayed or cancelled — verified via aviation data oracles, no paperwork.",
    trigger: "Delay tiers: 30m · 60m · 120m · cancelled",
  },
  {
    name: "Stablecoin Depeg",
    tag: "DeFi",
    description:
      "Automatic cover when USDC or USDT trades below threshold for 24 hours. Battle-tested Chainlink feed pattern.",
    trigger: "Price < $0.995 sustained → payout",
  },
];

const steps = [
  {
    num: "01",
    title: "Connect & Browse",
    body: "Connect your wallet and explore parametric cover products with live quotes and transparent terms.",
  },
  {
    num: "02",
    title: "Purchase Cover",
    body: "Pay USDC premium. Funds flow atomically into the on-chain ReservePool. Receive your Policy NFT instantly.",
  },
  {
    num: "03",
    title: "Verify & Track",
    body: "Every state change — purchase, activation, claim, payout — is emitted on-chain and indexed for full history.",
  },
  {
    num: "04",
    title: "Automatic Payout",
    body: "When oracle triggers fire, claims execute rule-based payouts from the reserve pool to your wallet.",
  },
];

const features = [
  {
    icon: ShieldIcon,
    title: "Immutable Policy NFTs",
    body: "ERC-721 tokens encode coverage amount, duration, trigger parameters, premium paid, and beneficiary — forever auditable.",
  },
  {
    icon: ChartIcon,
    title: "Transparent Reserve Pool",
    body: "LPs stake USDC and earn premium yield. Pool utilization, solvency ratio, and APY visible in real time.",
  },
  {
    icon: ZapIcon,
    title: "Parametric Automation",
    body: "Oracle-driven triggers replace slow claims adjusters. Extensible engine supports new product types cleanly.",
  },
  {
    icon: ChainIcon,
    title: "Full On-Chain History",
    body: "Anyone can verify ownership, status, premium flow, and payout history via block explorer or indexer — no trust required.",
  },
  {
    icon: LockIcon,
    title: "Insurance-Grade Security",
    body: "OpenZeppelin libraries, reentrancy guards, solvency invariants, and immutable core contracts with swappable oracle adapters.",
  },
];

const stats = [
  { label: "Settlement", value: "< 1 block", sub: "Parametric payouts" },
  { label: "Asset", value: "USDC", sub: "Native on Base" },
  { label: "Products", value: "3+", sub: "At MVP launch" },
  { label: "Audit Trail", value: "100%", sub: "On-chain events" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[900px] -translate-x-1/2 glow-orb animate-pulse-glow" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <ShieldIcon className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">VeriCover</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#products" className="transition hover:text-foreground">
            Products
          </a>
          <a href="#how" className="transition hover:text-foreground">
            How it works
          </a>
          <a href="#pools" className="transition hover:text-foreground">
            Liquidity
          </a>
          <a href="#disclaimer" className="transition hover:text-foreground">
            Disclaimer
          </a>
        </nav>
        <a
          href="#cta"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-dim"
        >
          Launch App
        </a>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Built on Base · MVP in development
            </div>
            <h1
              className="mb-6 text-4xl leading-[1.1] tracking-tight md:text-6xl"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Insurance finances,
              <br />
              <span className="text-accent">fully on-chain.</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted">
              VeriCover replaces the financial fund management and policy lifecycle
              of traditional insurance with immutable NFT policies, transparent USDC
              reserve pools, and automated parametric claims — verifiable by anyone.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-accent-dim"
              >
                Get Cover
                <ArrowRightIcon />
              </a>
              <a
                href="#pools"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-semibold transition hover:border-accent/30 hover:bg-surface-elevated"
              >
                Provide Liquidity
              </a>
            </div>
          </div>

          {/* Policy card mockup */}
          <div className="flex flex-1 justify-center lg:justify-end">
            <div className="card-shine animate-float w-full max-w-sm rounded-2xl border border-border bg-surface-elevated p-6 shadow-2xl shadow-accent/5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-muted">
                  Policy NFT #1042
                </span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  Active
                </span>
              </div>
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Coverage</span>
                  <span className="font-semibold">$25,000 USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Product</span>
                  <span>Stablecoin Depeg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Premium paid</span>
                  <span>142.50 USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Duration</span>
                  <span>90 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Beneficiary</span>
                  <span className="font-mono text-xs">0x7a3f…c91e</span>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  Lifecycle
                </p>
                <div className="flex items-center gap-1">
                  {["Minted", "Active", "Trigger", "Paid"].map((s, i) => (
                    <div key={s} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={`h-2 w-2 rounded-full ${i < 2 ? "bg-accent" : "bg-border"}`}
                      />
                      <span className="text-[10px] text-muted">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-center text-[11px] text-muted">
                Hash: 0x8f2a…verified on Base Sepolia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-border bg-surface/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="text-2xl font-bold text-accent md:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm font-medium">{s.label}</p>
              <p className="text-xs text-muted">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            The financial layer, reimagined
          </h2>
          <p className="mx-auto max-w-2xl text-muted">
            Premium collection, reserve management, claims automation, and immutable
            audit trails — all synchronized atomically on-chain.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-shine rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/20"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="relative z-10 bg-surface/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16">
            <h2
              className="mb-4 text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Parametric products
            </h2>
            <p className="max-w-2xl text-muted">
              Launching with three cover types that demonstrate automatic,
              rule-based claims. The engine is extensible for new parametric
              triggers.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.name}
                className="card-shine flex flex-col rounded-2xl border border-border bg-surface-elevated p-6"
              >
                <span className="mb-4 w-fit rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium text-accent">
                  {p.tag}
                </span>
                <h3 className="mb-2 text-xl font-semibold">{p.name}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
                <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                    Trigger
                  </p>
                  <p className="text-sm">{p.trigger}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            How it works
          </h2>
          <p className="mx-auto max-w-xl text-muted">
            From purchase to payout — every step is on-chain, indexed, and
            independently verifiable.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.num} className="relative">
              <span className="mb-4 block text-4xl font-bold text-accent/20">
                {s.num}
              </span>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LP Section */}
      <section id="pools" className="relative z-10 border-y border-border bg-surface/50 py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row">
          <div className="flex-1">
            <h2
              className="mb-4 text-3xl md:text-4xl"
              style={{ fontFamily: "var(--font-instrument-serif)" }}
            >
              Earn yield as a liquidity provider
            </h2>
            <p className="mb-6 max-w-lg text-muted">
              Stake USDC into the ReservePool and earn a share of premium revenue.
              Monitor pool health, utilization, and estimated APY in real time.
              Withdrawals respect solvency gates and epoch queues.
            </p>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                ERC-4626 vault shares representing pool ownership
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                73% of premiums streamed to LPs · 12% protocol · 15% risk buffer
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                MCR solvency ratio gates instant withdrawals
              </li>
            </ul>
          </div>
          <div className="card-shine w-full max-w-md rounded-2xl border border-border bg-surface-elevated p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">
              Pool snapshot (demo)
            </p>
            <div className="mb-6 space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted">Total assets</span>
                  <span className="font-semibold">$2,847,320</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-background">
                  <div className="h-full w-[68%] rounded-full bg-accent" />
                </div>
                <p className="mt-1 text-xs text-muted">68% utilization</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-background/40 p-3">
                  <p className="text-xs text-muted">Est. APY</p>
                  <p className="text-xl font-bold text-accent">8.4%</p>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-3">
                  <p className="text-xs text-muted">Solvency</p>
                  <p className="text-xl font-bold">124%</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-background transition hover:bg-accent-dim"
            >
              Stake USDC
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative z-10 mx-auto max-w-6xl px-6 py-24 text-center">
        <h2
          className="mb-4 text-3xl md:text-5xl"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Verify everything. Trust nothing.
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-muted">
          The full dApp launches on Base Sepolia first, then Base mainnet. Connect
          your wallet, purchase cover, and prove the entire policy lifecycle on a
          block explorer.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-background transition hover:bg-accent-dim"
          >
            Connect Wallet
            <ArrowRightIcon />
          </button>
          <a
            href="https://sepolia.basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-semibold transition hover:border-accent/30"
          >
            View on BaseScan
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <section
        id="disclaimer"
        className="relative z-10 border-t border-border bg-surface px-6 py-12"
      >
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
            Important disclaimer
          </p>
          <p className="text-sm leading-relaxed text-muted">
            VeriCover demonstrates the technical and financial advantages of
            blockchain for policy issuance, premium collection, reserve management,
            claims automation, and immutable audit trails. It does{" "}
            <strong className="text-foreground">not</strong> constitute a licensed
            insurance product. Full replacement of regulated physical insurance
            policies requires licensed insurance entities, jurisdictional approvals,
            KYC/AML, fiat on/off-ramps, and compliance infrastructure. This MVP is
            positioned as a decentralized parametric risk-sharing / cover protocol
            focused on the on-chain financial primitive layer.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4 text-accent" />
            <span>VeriCover · v0.1.0 MVP</span>
          </div>
          <p>Deployed on Base · Contracts & dApp coming soon</p>
        </div>
      </footer>
    </div>
  );
}