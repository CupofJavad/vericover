#!/usr/bin/env node
/**
 * Update deployed-addresses.json from forge broadcast artifacts (no re-broadcast).
 * Usage: node scripts/update-deployed-addresses.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const addressesPath = join(root, "src/lib/deployed-addresses.json");
const broadcastDir = join(root, "contracts/broadcast/Deploy.s.sol/84532");

function latestBroadcastArtifact() {
  if (!statSync(broadcastDir, { throwIfNoEntry: false })) return null;

  const direct = join(broadcastDir, "run-latest.json");
  if (statSync(direct, { throwIfNoEntry: false })?.isFile()) {
    return direct;
  }

  const runs = readdirSync(broadcastDir)
    .filter((d) => d.startsWith("run-"))
    .map((d) => join(broadcastDir, d))
    .filter((p) => statSync(p).isDirectory())
    .sort()
    .reverse();

  for (const runDir of runs) {
    const artifact = join(runDir, "run-latest.json");
    if (statSync(artifact, { throwIfNoEntry: false })?.isFile()) {
      return artifact;
    }
  }

  return null;
}

const broadcastArtifact = latestBroadcastArtifact();
if (!broadcastArtifact) {
  console.error("No broadcast artifacts found at", broadcastDir);
  process.exit(1);
}

const latestTx = JSON.parse(readFileSync(broadcastArtifact, "utf8"));

const nameMap = {
  ProductPassport721: "productPassport721",
  WarrantyRegistry: "warrantyRegistry",
  WarrantyClaimManager: "warrantyClaimManager",
  WarrantyRedemption: "warrantyRedemption",
  NovaTechVault: "novaTechVault",
  SoundForgeVault: "soundForgeVault",
};

const current = JSON.parse(readFileSync(addressesPath, "utf8"));

for (const tx of latestTx.transactions ?? []) {
  const contractName = tx.contractName;
  const field = nameMap[contractName];
  if (field && tx.contractAddress) {
    current[field] = tx.contractAddress;
  }
}

current.deployedAt = new Date().toISOString();
delete current.deployNote;

writeFileSync(addressesPath, JSON.stringify(current, null, 2) + "\n");
console.log("Updated", addressesPath);
for (const [name, field] of Object.entries(nameMap)) {
  console.log(`  ${name}: ${current[field]}`);
}