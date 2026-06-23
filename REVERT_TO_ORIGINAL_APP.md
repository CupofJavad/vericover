# Revert to Original App (Insurance-Only)

**Owner:** Javad (@Zarathustra_F)  
**Last updated:** June 23, 2026

This document explains how to return VeriCover to the **insurance-only** version (parametric policies, ReservePool, dApp) without digital warranty extensions.

---

## Protection tags & branches

| Reference | Commit / branch | What it contains |
|-----------|-----------------|------------------|
| `original-app-v1` | `3325604` | Early landing page snapshot (pre-dApp). Historical baseline. |
| `pre-digital-warranties-v1` | `16d9fda` | **Full production app before warranty work** — landing, how-it-works, wallet dApp, GitHub Pages deploy. |
| `master` | `16d9fda` (at branch creation) | Same as pre-warranty snapshot; production line. |
| `feature/digital-warranties` | branched from `16d9fda` | Digital warranty extension (planning + implementation). |

---

## Quick revert (recommended)

Return to the insurance-only production app:

```bash
cd C:\Users\javad\vericover
git fetch origin
git checkout master
git reset --hard pre-digital-warranties-v1
# Optional: force remote master if you need to undo merged warranty work
# git push origin master --force-with-lease
```

Or checkout the tag directly:

```bash
git checkout pre-digital-warranties-v1
```

---

## Discard warranty branch only

If warranty work stays on the feature branch and you want pure insurance on `master`:

```bash
git checkout master
git reset --hard pre-digital-warranties-v1
git branch -D feature/digital-warranties   # only if you want to delete local branch
```

---

## Restore from `original-app-v1` (older baseline)

```bash
git checkout original-app-v1
```

Note: This predates the live dApp (`/app` routes). Use `pre-digital-warranties-v1` for the complete insurance MVP site.

---

## Deploy after revert

```bash
npm ci
npm run build
git push origin master
```

GitHub Actions will redeploy to: https://cupofjavad.github.io/vericover/

---

## Current work branch

**Active development for warranties:** `feature/digital-warranties`

Do **not** merge into `master` until Javad approves the warranty plan and implementation review is complete.

```bash
git checkout feature/digital-warranties
```

---

## Contact

Platform owner: Javad — https://x.com/Zarathustra_F