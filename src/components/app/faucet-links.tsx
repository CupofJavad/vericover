import { baseSepoliaFaucets, faucetDocsUrl } from "@/lib/faucets";

export function FaucetLinks({ compact = false }: { compact?: boolean }) {
  const items = compact
    ? baseSepoliaFaucets.filter((f) => f.recommended)
    : baseSepoliaFaucets;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-400"}>
        Need Base Sepolia ETH for gas? Try any faucet below (same network — chain ID{" "}
        <strong className="text-teal-300">84532</strong>).
      </p>
      <ul className={compact ? "space-y-1.5" : "space-y-2"}>
        {items.map((faucet) => (
          <li key={faucet.url}>
            <a
              href={faucet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              {faucet.name}
            </a>
            <span className="text-slate-500"> — {faucet.note}</span>
          </li>
        ))}
      </ul>
      <a
        href={faucetDocsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-slate-500 hover:text-teal-400 hover:underline"
      >
        Full faucet list (Base docs)
      </a>
    </div>
  );
}