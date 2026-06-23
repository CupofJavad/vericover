# VeriCover System Overview — Insurance + Warranties

**Owner:** Javad · **Version:** 0.2.0-plan · **Branch:** `feature/digital-warranties`

## Shared infrastructure

| Layer | Shared? | Components |
|-------|---------|------------|
| Chain | Yes | Base Sepolia → Base Mainnet |
| Frontend | Yes | Next.js app, wagmi, indexer |
| IPFS/Pinata | Yes | Metadata, terms PDFs, claim evidence |
| Event indexer | Yes | Ponder — policies + passports + claims |
| Access control | Yes | OpenZeppelin roles, multisig admin |

## Parallel product rails

```
                    ┌─────────────────────────────────────┐
                    │           VeriCover Protocol         │
                    │         (Founded by Javad)           │
                    └─────────────────────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
    ┌─────────────────────┐                       ┌─────────────────────┐
    │  INSURANCE RAIL     │                       │  WARRANTY RAIL      │
    │  (existing)         │                       │  (new)              │
    ├─────────────────────┤                       ├─────────────────────┤
    │ PolicyNFT           │                       │ ProductPassport721  │
    │ ParametricEngine    │                       │ WarrantyClaimMgr    │
    │ OracleRegistry      │                       │ AttestationRegistry │
    │ InsuranceTranche    │                       │ WarrantyTranche(s)  │
    │ LP: yield farmers   │                       │ LP: manufacturers   │
    └─────────────────────┘                       └─────────────────────┘
              │                                               │
              └───────────────────┬───────────────────────────┘
                                  ▼
                        ReservePoolCoordinator
                        (routing only — no shared loss)
```

## Optional link

Extended protection Policy NFT may reference `passportId` for accidental/parametric events on a registered product (e.g. flood damage to appliance).

## MVP scope boundary

**In:** Consumer electronics warranties, manufacturer issuance API, repair/refund claims, transferable passports.

**Out:** Full EU DPP registry integration, IoT oracles, vehicle title integration, licensed insurance crossover.