const steps = [
  {
    num: "01",
    title: "Connect & quote",
    body: "Connect wallet, browse parametric products, and get a live USDC quote with transparent terms.",
  },
  {
    num: "02",
    title: "Purchase cover",
    body: "Pay premium in USDC. Funds flow atomically to the ReservePool. Receive your Policy NFT instantly.",
  },
  {
    num: "03",
    title: "Verify on-chain",
    body: "Every state change emits events. Full lifecycle history is indexed and exportable — no trust in the frontend.",
  },
  {
    num: "04",
    title: "Automatic payout",
    body: "Oracle triggers fire parametric claims. Payout executes from the reserve pool to your wallet in one transaction.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="border-y border-white/10 bg-[#0d1526]/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2
          className="mb-12 text-center text-3xl text-white md:text-4xl"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          How it works
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.num}>
              <span className="mb-4 block text-4xl font-bold text-teal-400/20">
                {s.num}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}