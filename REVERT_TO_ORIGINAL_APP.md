# Revert to Original App (Insurance-Only)

**Owner:** Javad (@Zarathustra_F)  
**Last updated:** June 23, 2026

This document explains how to return VeriCover to earlier snapshots — insurance-only, pre-warranty, or pre-UX-refresh — without losing work.

---

## Protection tags & branches

| Reference | Commit | What it contains |
|-----------|--------|------------------|
| `original-app-v1` | `3325604` | Early landing page snapshot (pre-dApp). Historical baseline. |
| `pre-digital-warranties-v1` | `16d9fda` | **Full production app before warranty work** — landing, how-it-works, wallet dApp, GitHub Pages deploy. |
| `pre-traditional-ux-v1` | `9b0c8e5` | **Current production before traditional UX refresh** — on-chain warranty rail live on Base Sepolia, faucet UX, MetaMask fix. |
| `master` | latest | Production line (GitHub Pages). |
| `feature/digital-warranties` | branched from `16d9fda` | Digital warranty extension (contracts + UI). |
| `feature/traditional-warranty-ux` | branched from `pre-traditional-ux-v1` | Traditional warranty UX refresh (non-crypto language, onboarding). |

---

## Quick revert commands

### Undo traditional UX refresh only (keep on-chain warranties)

```bash
cd C:\Users\javad\vericover
git fetch origin
git checkout master
git reset --hard pre-traditional-ux-v1
git push origin master --force-with-lease
```

### Return to insurance-only production app (no warranties)

```bash
cd C:\Users\javad\vericover
git fetch origin
git checkout master
git reset --hard pre-digital-warranties-v1
git push origin master --force-with-lease
```

### Checkout a tag without changing master

```bash
git fetch origin --tags
git checkout pre-traditional-ux-v1    # on-chain warranties, crypto-native UX
git checkout pre-digital-warranties-v1   # insurance-only MVP
git checkout original-app-v1          # earliest landing only
```

---

## Discard feature branch work

```bash
git checkout master
git branch -D feature/traditional-warranty-ux   # local only
# Remote: git push origin --delete feature/traditional-warranty-ux
```

---

## Deploy after revert

```bash
npm ci
npm run build
git push origin master
```

GitHub Actions redeploys to: https://cupofjavad.github.io/vericover/

---

## Current work branch

**Active development for traditional UX:** `feature/traditional-warranty-ux`

Do **not** merge into `master` until Javad approves the UX plan and implementation review is complete.

```bash
git fetch origin
git checkout -b feature/traditional-warranty-ux pre-traditional-ux-v1
# or: git checkout feature/traditional-warranty-ux
```

---

## On-chain warranty contracts (Base Sepolia)

Deployed at `pre-traditional-ux-v1` / `9b0c8e5`. Reverting UX does **not** undeploy contracts.

| Contract | Address |
|----------|---------|
| ProductPassport721 | `0x23193001a1C61cDEB68E7bd1a4E87a38eC586165` |
| WarrantyRegistry | `0x4D25946083f37910F8837406aC0dd2B5E4543075` |
| WarrantyClaimManager | `0xE44123dEB8fE2C258B7B73d85557126ADDC02494` |
| WarrantyRedemption | `0xc0408757A76715dC3E9761be35aA790b94d64008` |

---

## Contact

Platform owner: Javad — https://x.com/Zarathustra_F