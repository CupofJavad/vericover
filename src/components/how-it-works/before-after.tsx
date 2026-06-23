const rows = [
  {
    topic: "Buying cover",
    before: "Paper forms, slow quotes, unclear terms buried in fine print",
    after: "Pick a product, see your price instantly, terms locked in a digital policy you own",
  },
  {
    topic: "Filing a claim",
    before: "Weeks of paperwork, adjusters, phone calls, and disputes",
    after: "If the trigger event happened, payout runs automatically — often in minutes",
  },
  {
    topic: "Where your premium goes",
    before: "Opaque company accounts — hard to know how funds are used",
    after: "Premium flows into a public pool you can track on-chain in real time",
  },
  {
    topic: "Proof of coverage",
    before: "Policy document in a drawer or email — can be disputed or lost",
    after: "Your policy is a digital certificate (NFT) with a permanent, verifiable history",
  },
];

export function BeforeAfter() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="grid grid-cols-3 bg-[#131f35] text-xs font-semibold uppercase tracking-wider text-slate-400">
        <div className="p-4" />
        <div className="border-l border-white/10 p-4 text-center">Traditional</div>
        <div className="border-l border-white/10 p-4 text-center text-teal-300">
          VeriCover
        </div>
      </div>
      {rows.map((row) => (
        <div
          key={row.topic}
          className="grid grid-cols-3 border-t border-white/10 bg-[#0d1526]/60 text-sm"
        >
          <div className="p-4 font-medium text-white">{row.topic}</div>
          <div className="border-l border-white/10 p-4 text-slate-400">{row.before}</div>
          <div className="border-l border-white/10 p-4 text-slate-300">{row.after}</div>
        </div>
      ))}
    </div>
  );
}