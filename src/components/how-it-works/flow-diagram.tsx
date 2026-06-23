export function FlowDiagram() {
  const steps = [
    { num: 1, title: "You pick cover", sub: "Choose what to protect" },
    { num: 2, title: "Pay in USDC", sub: "Money goes to the pool" },
    { num: 3, title: "Get your policy", sub: "Digital certificate (NFT)" },
    { num: 4, title: "Event happens", sub: "Oracle checks the trigger" },
    { num: 5, title: "Auto payout", sub: "No paperwork fight" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#131f35] p-6 md:p-8">
      <h3 className="mb-6 text-center text-lg font-semibold text-white">
        The journey — from purchase to payout
      </h3>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {steps.map((step, i) => (
          <div key={step.num} className="flex flex-1 flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-400/15 text-lg font-bold text-teal-300 ring-1 ring-teal-400/30">
              {step.num}
            </div>
            <p className="text-sm font-semibold text-white">{step.title}</p>
            <p className="mt-1 text-xs text-slate-400">{step.sub}</p>
            {i < steps.length - 1 && (
              <span className="mt-3 hidden text-teal-400/50 md:inline" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">
        Every step is recorded on a public ledger anyone can verify — like a
        spreadsheet the whole world can read, but nobody can secretly edit.
      </p>
    </div>
  );
}