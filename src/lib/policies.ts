import type { ProductId } from "./products";

export type PolicyStatus = "active" | "claimed" | "expired";

export interface Policy {
  id: string;
  tokenId: number;
  productId: ProductId;
  productName: string;
  coverage: number;
  premium: number;
  days: number;
  beneficiary: string;
  purchasedAt: number;
  expiresAt: number;
  status: PolicyStatus;
  txHash: string;
}

const STORAGE_KEY = "vericover_policies_v1";
const LP_KEY = "vericover_lp_v1";

export function getPolicies(address: string): Policy[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, Policy[]>;
    return (all[address.toLowerCase()] ?? []).map(refreshStatus);
  } catch {
    return [];
  }
}

function refreshStatus(policy: Policy): Policy {
  if (policy.status === "active" && Date.now() > policy.expiresAt) {
    return { ...policy, status: "expired" };
  }
  return policy;
}

export function savePolicy(address: string, policy: Policy): void {
  const key = address.toLowerCase();
  const raw = localStorage.getItem(STORAGE_KEY);
  const all: Record<string, Policy[]> = raw ? JSON.parse(raw) : {};
  const list = all[key] ?? [];
  all[key] = [policy, ...list];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getNextTokenId(address: string): number {
  const policies = getPolicies(address);
  if (policies.length === 0) return 1001;
  return Math.max(...policies.map((p) => p.tokenId)) + 1;
}

export interface LpPosition {
  staked: number;
  stakedAt: number;
  earnings: number;
}

export function getLpPosition(address: string): LpPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LP_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, LpPosition>;
    return all[address.toLowerCase()] ?? null;
  } catch {
    return null;
  }
}

export function saveLpPosition(address: string, position: LpPosition): void {
  const key = address.toLowerCase();
  const raw = localStorage.getItem(LP_KEY);
  const all: Record<string, LpPosition> = raw ? JSON.parse(raw) : {};
  all[key] = position;
  localStorage.setItem(LP_KEY, JSON.stringify(all));
}

export function generateTxHash(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}