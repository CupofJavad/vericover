const faqs = [
  {
    q: "Is VeriCover licensed insurance?",
    a: "No. VeriCover is a decentralized parametric risk-sharing protocol demonstrating on-chain financial primitives for cover and capital provision. It is not a licensed insurance product and does not replace regulated physical insurance without licensed entities, jurisdictional approvals, and compliance infrastructure.",
  },
  {
    q: "How do LPs earn yield?",
    a: "When policyholders pay USDC premiums, 73% is streamed to liquidity providers over the cover period. LPs hold ERC-4626 vault shares representing their pro-rata ownership of the ReservePool. Yield comes from real premium revenue — not inflationary token emissions.",
  },
  {
    q: "What risks do LPs take?",
    a: "LP capital backs active cover. When parametric claims pay out, the pool absorbs losses — first from free liquidity, then the risk buffer, then pro-rata across LP NAV. Withdrawals may be queued when utilization is high or solvency ratio falls below 100%.",
  },
  {
    q: "How are claims triggered?",
    a: "Parametric products use oracle-driven triggers — Chainlink data feeds for depeg cover, aviation data for flight delay, and multi-signal monitoring for exploit cover. Triggers follow a confirmation window to prevent gaming. Payouts execute automatically when conditions are met.",
  },
  {
    q: "Why Base?",
    a: "Base offers native USDC, low fees, strong DeFi ecosystem, Chainlink oracle support, and Coinbase distribution rails — ideal for a USDC-denominated cover protocol targeting both retail buyers and institutional LPs.",
  },
  {
    q: "Who built VeriCover?",
    a: "VeriCover was founded and built by Javad (@Zarathustra_F), focused on replacing the opaque financial layer of traditional insurance with immutable, verifiable on-chain infrastructure.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-white/10 bg-[#0d1526]/40 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2
          className="mb-8 text-center text-3xl text-white md:text-4xl"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border border-white/10 bg-[#131f35] px-5 py-4"
            >
              <summary className="cursor-pointer list-none font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.q}
                  <span className="text-teal-400 transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}