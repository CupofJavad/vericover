# ADR-007: Digital Product Warranties Extension

**Status:** Proposed (awaiting Javad approval)  
**Date:** June 23, 2026  
**Author:** Javad (@Zarathustra_F)  
**Branch:** `feature/digital-warranties`

## Context

VeriCover currently issues parametric **insurance-style Policy NFTs** backed by a shared ReservePool. Javad wants to extend the platform to support **digital warranties for physical products** — immutable, verifiable, trackable, and financially backed — without breaking insurance functionality.

## Decision

Adopt a **dual-rail architecture**:

1. **ProductPassport721** (new ERC-721) — root identity for a physical unit (serial-linked).
2. **WarrantyClaimManager** (new) — discretionary repair/replace/refund state machine.
3. **WarrantyTrancheVault** (new ERC-4626 sub-vault per manufacturer) — isolated capital; **not** parametric LP pool.
4. **Policy721** (existing) — unchanged; optional extended/catastrophic cover linked via `passportId`.

## Rationale

| Option | Rejected / Chosen | Why |
|--------|-------------------|-----|
| Extend Policy NFT for warranties | Rejected | Conflates insurance law with product warranty; parametric oracle unsuitable for defect claims |
| Shared ReservePool for warranty payouts | Rejected | LP capital did not underwrite discretionary manufacturer defect risk |
| Separate Passport + manufacturer tranches | **Chosen** | Clean liability, resale support, EU DPP alignment, reuses pool patterns |

## Physical product linking

- Manufacturer pre-registers `serialHash = keccak256(serial + sku + batch)`.
- QR on product → read-only DPP viewer (IPFS JSON).
- Claim code / NFC ceremony → mint Passport NFT to consumer wallet.
- On-chain: `serialHash`, `warrantyStart`, `warrantyEnd`, `termsHash`, `manufacturerId`.

## Consequences

**Positive:** Second-hand transfer, repair history, manufacturer-funded reserves, insurance module untouched.

**Negative:** Additional contracts, merchant onboarding, discretionary fraud controls required.

## Compliance note

Digital warranty infrastructure — not licensed insurance. Disclaimers remain mandatory.