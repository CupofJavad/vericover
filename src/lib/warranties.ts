import { generateTxHash } from "./policies";

export type ClaimType = "repair" | "replace" | "refund";
export type ClaimStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "paid";
export type PassportStatus = "active" | "expired" | "claimed";

export interface WarrantyProduct {
  sku: string;
  name: string;
  manufacturer: string;
  manufacturerId: string;
  category: string;
  warrantyDays: number;
  maxClaimValue: number;
  claimCode: string;
  serialPrefix: string;
}

export interface ProductPassport {
  id: string;
  tokenId: number;
  sku: string;
  productName: string;
  manufacturer: string;
  manufacturerId: string;
  serialNumber: string;
  serialHash: string;
  owner: string;
  warrantyStart: number;
  warrantyEnd: number;
  termsHash: string;
  status: PassportStatus;
  registeredAt: number;
  mintTxHash: string;
}

export interface WarrantyClaim {
  id: string;
  passportId: string;
  tokenId: number;
  productName: string;
  claimType: ClaimType;
  description: string;
  status: ClaimStatus;
  submittedAt: number;
  resolvedAt?: number;
  payoutAmount?: number;
  txHash: string;
}

const PASSPORT_KEY = "vericover_passports_v1";
const CLAIM_KEY = "vericover_warranty_claims_v1";
const USED_CODES_KEY = "vericover_used_claim_codes_v1";

/** Demo catalog — manufacturers pre-register serials; consumer redeems claim code */
export const warrantyCatalog: WarrantyProduct[] = [
  {
    sku: "VC-LAP-15",
    name: "VeriCover Pro Laptop 15\"",
    manufacturer: "NovaTech Industries",
    manufacturerId: "mfr-novatech",
    category: "Electronics",
    warrantyDays: 730,
    maxClaimValue: 1200,
    claimCode: "VERI-LAPTOP-2026-A1",
    serialPrefix: "NT-LAP",
  },
  {
    sku: "VC-PHN-X2",
    name: "VeriCover Phone X2",
    manufacturer: "NovaTech Industries",
    manufacturerId: "mfr-novatech",
    category: "Electronics",
    warrantyDays: 365,
    maxClaimValue: 800,
    claimCode: "VERI-PHONE-2026-B2",
    serialPrefix: "NT-PHN",
  },
  {
    sku: "VC-AUD-P3",
    name: "VeriCover Audio Pods P3",
    manufacturer: "SoundForge Labs",
    manufacturerId: "mfr-soundforge",
    category: "Audio",
    warrantyDays: 180,
    maxClaimValue: 150,
    claimCode: "VERI-EARBUDS-2026-C3",
    serialPrefix: "SF-AUD",
  },
];

export function hashSerial(serial: string, sku: string): string {
  const input = `${serial}:${sku}:vericover-v1`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `0x${hex}${hex}${hex}${hex}`.slice(0, 18);
}

export function findProductByClaimCode(code: string): WarrantyProduct | null {
  const normalized = code.trim().toUpperCase();
  return (
    warrantyCatalog.find((p) => p.claimCode === normalized) ?? null
  );
}

function getUsedCodes(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(USED_CODES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function markCodeUsed(code: string): void {
  const used = getUsedCodes();
  used.add(code.trim().toUpperCase());
  localStorage.setItem(USED_CODES_KEY, JSON.stringify([...used]));
}

export function isClaimCodeUsed(code: string): boolean {
  return getUsedCodes().has(code.trim().toUpperCase());
}

export function getPassports(address: string): ProductPassport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, ProductPassport[]>;
    return (all[address.toLowerCase()] ?? []).map(refreshPassportStatus);
  } catch {
    return [];
  }
}

function refreshPassportStatus(passport: ProductPassport): ProductPassport {
  if (passport.status === "active" && Date.now() > passport.warrantyEnd) {
    return { ...passport, status: "expired" };
  }
  return passport;
}

export function getNextPassportTokenId(address: string): number {
  const passports = getPassports(address);
  if (passports.length === 0) return 5001;
  return Math.max(...passports.map((p) => p.tokenId)) + 1;
}

export interface RegisterResult {
  ok: true;
  passport: ProductPassport;
}

export interface RegisterError {
  ok: false;
  error: string;
}

export function registerPassport(
  address: string,
  claimCode: string,
  serialNumber: string
): RegisterResult | RegisterError {
  const product = findProductByClaimCode(claimCode);
  if (!product) {
    return { ok: false, error: "Invalid claim code. Check the QR card in your product box." };
  }
  if (isClaimCodeUsed(claimCode)) {
    return { ok: false, error: "This claim code has already been redeemed." };
  }
  const serial = serialNumber.trim();
  if (serial.length < 6) {
    return { ok: false, error: "Enter the full serial number from your product label." };
  }
  if (!serial.toUpperCase().startsWith(product.serialPrefix)) {
    return {
      ok: false,
      error: `Serial should start with ${product.serialPrefix} (see product label).`,
    };
  }

  const now = Date.now();
  const tokenId = getNextPassportTokenId(address);
  const passport: ProductPassport = {
    id: `${address}-${tokenId}`,
    tokenId,
    sku: product.sku,
    productName: product.name,
    manufacturer: product.manufacturer,
    manufacturerId: product.manufacturerId,
    serialNumber: serial,
    serialHash: hashSerial(serial, product.sku),
    owner: address,
    warrantyStart: now,
    warrantyEnd: now + product.warrantyDays * 86400000,
    termsHash: hashSerial(product.sku, "terms-v1"),
    status: "active",
    registeredAt: now,
    mintTxHash: generateTxHash(),
  };

  const key = address.toLowerCase();
  const raw = localStorage.getItem(PASSPORT_KEY);
  const all: Record<string, ProductPassport[]> = raw ? JSON.parse(raw) : {};
  const list = all[key] ?? [];
  all[key] = [passport, ...list];
  localStorage.setItem(PASSPORT_KEY, JSON.stringify(all));
  markCodeUsed(claimCode);

  return { ok: true, passport };
}

export function getClaims(address: string): WarrantyClaim[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLAIM_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as Record<string, WarrantyClaim[]>;
    return all[address.toLowerCase()] ?? [];
  } catch {
    return [];
  }
}

export function getClaimsForPassport(
  address: string,
  passportId: string
): WarrantyClaim[] {
  return getClaims(address).filter((c) => c.passportId === passportId);
}

export interface SubmitClaimResult {
  ok: true;
  claim: WarrantyClaim;
}

export interface SubmitClaimError {
  ok: false;
  error: string;
}

export function submitClaim(
  address: string,
  passportId: string,
  claimType: ClaimType,
  description: string
): SubmitClaimResult | SubmitClaimError {
  const passports = getPassports(address);
  const passport = passports.find((p) => p.id === passportId);
  if (!passport) {
    return { ok: false, error: "Passport not found." };
  }
  if (passport.status !== "active") {
    return { ok: false, error: "Warranty is not active for this product." };
  }
  const existing = getClaimsForPassport(address, passportId);
  const open = existing.find(
    (c) => c.status === "submitted" || c.status === "under_review"
  );
  if (open) {
    return { ok: false, error: "You already have an open claim for this product." };
  }
  const desc = description.trim();
  if (desc.length < 20) {
    return { ok: false, error: "Describe the issue in at least 20 characters." };
  }

  const product = warrantyCatalog.find((p) => p.sku === passport.sku);
  const payout =
    claimType === "refund"
      ? (product?.maxClaimValue ?? 100) * 0.8
      : claimType === "replace"
        ? product?.maxClaimValue ?? 100
        : (product?.maxClaimValue ?? 100) * 0.3;

  const claim: WarrantyClaim = {
    id: `${passportId}-claim-${Date.now()}`,
    passportId,
    tokenId: passport.tokenId,
    productName: passport.productName,
    claimType,
    description: desc,
    status: "submitted",
    submittedAt: Date.now(),
    payoutAmount: payout,
    txHash: generateTxHash(),
  };

  const key = address.toLowerCase();
  const raw = localStorage.getItem(CLAIM_KEY);
  const all: Record<string, WarrantyClaim[]> = raw ? JSON.parse(raw) : {};
  const list = all[key] ?? [];
  all[key] = [claim, ...list];
  localStorage.setItem(CLAIM_KEY, JSON.stringify(all));

  return { ok: true, claim };
}

/** Simulates manufacturer review — advances claim after delay in demo */
export function simulateClaimProgress(
  address: string,
  claimId: string
): WarrantyClaim | null {
  const key = address.toLowerCase();
  const raw = localStorage.getItem(CLAIM_KEY);
  if (!raw) return null;
  const all = JSON.parse(raw) as Record<string, WarrantyClaim[]>;
  const list = all[key] ?? [];
  const idx = list.findIndex((c) => c.id === claimId);
  if (idx === -1) return null;

  const claim = list[idx];
  let next: WarrantyClaim;
  if (claim.status === "submitted") {
    next = { ...claim, status: "under_review" };
  } else if (claim.status === "under_review") {
    next = {
      ...claim,
      status: "approved",
      resolvedAt: Date.now(),
    };
  } else if (claim.status === "approved") {
    next = {
      ...claim,
      status: "paid",
      resolvedAt: claim.resolvedAt ?? Date.now(),
    };
  } else {
    return claim;
  }

  list[idx] = next;
  all[key] = list;
  localStorage.setItem(CLAIM_KEY, JSON.stringify(all));
  return next;
}

export const claimTypeLabels: Record<ClaimType, string> = {
  repair: "Repair",
  replace: "Replacement",
  refund: "Refund",
};

export const claimStatusLabels: Record<ClaimStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid out",
};