import deployed from "./deployed-addresses.json";

const zero = "0x0000000000000000000000000000000000000000" as const;

/** Base Sepolia warranty rail contract addresses */
export const warrantyContracts = {
  productPassport721: (process.env.NEXT_PUBLIC_PASSPORT_ADDRESS ??
    deployed.productPassport721) as `0x${string}`,
  warrantyRegistry: (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ??
    deployed.warrantyRegistry) as `0x${string}`,
  warrantyClaimManager: (process.env.NEXT_PUBLIC_CLAIM_MANAGER_ADDRESS ??
    deployed.warrantyClaimManager) as `0x${string}`,
  warrantyRedemption: (process.env.NEXT_PUBLIC_REDEMPTION_ADDRESS ??
    deployed.warrantyRedemption) as `0x${string}`,
  novaTechVault: (process.env.NEXT_PUBLIC_NOVATECH_VAULT ??
    deployed.novaTechVault) as `0x${string}`,
  soundForgeVault: (process.env.NEXT_PUBLIC_SOUNDFORGE_VAULT ??
    deployed.soundForgeVault) as `0x${string}`,
} as const;

export function isWarrantyRailDeployed(): boolean {
  return (
    warrantyContracts.warrantyRedemption !== zero &&
    deployed.deployedAt != null
  );
}

export const deployedMeta = {
  chainId: deployed.chainId,
  network: deployed.network,
  deployedAt: deployed.deployedAt,
  deployer: "deployer" in deployed ? (deployed as { deployer?: string }).deployer : undefined,
} as const;