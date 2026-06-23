# VeriCover Warranty Contracts

Solidity reference implementation for ADR-007 (Digital Product Warranties).

## Install Foundry (Windows)

```powershell
# Git Bash or WSL recommended:
curl -L https://foundry.paradigm.xyz | bash
foundryup

cd contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge build
forge test
```

## Contracts

| Contract | Role |
|----------|------|
| `ProductPassport721` | ERC-721 product identity linked to `serialHash` |
| `WarrantyRegistry` | Manufacturer roles, serial pre-registration |
| `WarrantyTrancheVault` | ERC-4626 per-manufacturer reserve (isolated from parametric LP pool) |
| `WarrantyClaimManager` | Repair / replace / refund claim state machine |

Insurance rail contracts are **unchanged** — warranty capital is manufacturer-funded only.