"use client";

import { useEffect, useRef, useState } from "react";
import type { Connector } from "wagmi";
import {
  useConnection,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useConnectionEffect,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { Button } from "@/components/ui/button";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function connectorLabel(name: string, id: string) {
  if (id === "injected" || name === "Browser Wallet") {
    return "Browser Wallet (MetaMask / Rabby)";
  }
  if (name.toLowerCase().includes("coinbase")) {
    return "Coinbase Wallet";
  }
  return name;
}

/** Hide generic injected when MetaMask EIP-6963 connector is available. */
function dedupeConnectors(connectors: readonly Connector[]) {
  const hasMetaMask = connectors.some((c) => c.id === "metaMaskSDK");
  return connectors.filter((c) => {
    if (c.ready === false) return false;
    if (hasMetaMask && c.id === "injected") return false;
    return true;
  });
}

export function ConnectButton({ className }: { className?: string }) {
  const { address, isConnected, isConnecting, isReconnecting, chainId } =
    useConnection();
  const { connectAsync, connectors, isPending, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const available = dedupeConnectors(connectors);

  useConnectionEffect({
    onConnect({ chainId: connectedChainId }) {
      if (connectedChainId !== baseSepolia.id) {
        switchChain({ chainId: baseSepolia.id });
      }
    },
  });

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  async function handleConnect(connector: (typeof available)[number]) {
    setLocalError(null);
    reset();
    setOpen(false);
    try {
      await connectAsync({ connector });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Wallet connection failed";
      if (message.toLowerCase().includes("user rejected")) {
        setLocalError("Connection cancelled in wallet.");
      } else if (message.includes("@metamask/connect-evm")) {
        setLocalError("MetaMask SDK missing — try Browser Wallet instead.");
      } else {
        setLocalError(message);
      }
    }
  }

  const wrongNetwork = isConnected && chainId !== baseSepolia.id;
  const busy = isPending || isConnecting || isReconnecting;
  const displayError = localError ?? error?.message;

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className ?? ""}`}>
        {wrongNetwork ? (
          <Button
            onClick={() => switchChain({ chainId: baseSepolia.id })}
            disabled={isSwitching}
            className="bg-amber-500 text-[#060b14] hover:bg-amber-400"
          >
            {isSwitching ? "Switching…" : "Switch to Base Sepolia"}
          </Button>
        ) : (
          <span className="hidden rounded-full border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-xs text-teal-300 sm:inline">
            Base Sepolia
          </span>
        )}
        <Button
          variant="outline"
          onClick={() => disconnect()}
          className="border-white/15 bg-white/5 font-mono text-sm text-white hover:bg-white/10"
        >
          {truncate(address)}
        </Button>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`relative ${className ?? ""}`}>
      <Button
        onClick={() => {
          setLocalError(null);
          reset();
          if (available.length === 1) {
            void handleConnect(available[0]);
          } else {
            setOpen((v) => !v);
          }
        }}
        disabled={busy || available.length === 0}
        className="bg-teal-400 font-semibold text-[#060b14] hover:bg-teal-300"
      >
        {busy ? "Connecting…" : "Connect Wallet"}
      </Button>

      {available.length === 0 && (
        <p className="mt-2 max-w-xs text-xs text-amber-300">
          Install{" "}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            MetaMask
          </a>{" "}
          or{" "}
          <a
            href="https://www.coinbase.com/wallet/downloads"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Coinbase Wallet
          </a>{" "}
          extension, then refresh this page.
        </p>
      )}

      {open && available.length > 1 && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[240px] rounded-xl border border-white/15 bg-[#131f35] p-2 shadow-xl">
          {available.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              onClick={() => void handleConnect(connector)}
              disabled={busy}
              className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
            >
              {connectorLabel(connector.name, connector.id)}
            </button>
          ))}
        </div>
      )}

      {displayError && (
        <p className="mt-2 max-w-xs text-xs text-red-400" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}