#!/usr/bin/env node
/**
 * Deploy warranty contracts to Base Sepolia and update deployed-addresses.json
 * Usage: DEPLOYER_PRIVATE_KEY=0x... node scripts/deploy-warranty.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const addressesPath = join(root, "src/lib/deployed-addresses.json");

const key = process.env.DEPLOYER_PRIVATE_KEY;
if (!key) {
  console.error("Set DEPLOYER_PRIVATE_KEY to deploy.");
  process.exit(1);
}

const rpc = process.env.BASE_SEPOLIA_RPC ?? "https://sepolia.base.org";
const forge =
  process.platform === "win32"
    ? join(process.env.USERPROFILE ?? "", ".foundry", "bin", "forge.exe")
    : "forge";

const bashForge = `"${forge}" script script/Deploy.s.sol:Deploy --rpc-url ${rpc} --broadcast -vvv`;

try {
  const out = execSync(bashForge, {
    cwd: join(root, "contracts"),
    env: { ...process.env, DEPLOYER_PRIVATE_KEY: key },
    encoding: "utf8",
    shell: process.platform === "win32" ? true : "/bin/bash",
  });
  console.log(out);

  const patterns = {
    productPassport721: /ProductPassport721\s+(0x[a-fA-F0-9]{40})/,
    warrantyRegistry: /WarrantyRegistry\s+(0x[a-fA-F0-9]{40})/,
    warrantyClaimManager: /WarrantyClaimManager\s+(0x[a-fA-F0-9]{40})/,
    warrantyRedemption: /WarrantyRedemption\s+(0x[a-fA-F0-9]{40})/,
    novaTechVault: /NovaTechVault\s+(0x[a-fA-F0-9]{40})/,
    soundForgeVault: /SoundForgeVault\s+(0x[a-fA-F0-9]{40})/,
  };

  const current = JSON.parse(readFileSync(addressesPath, "utf8"));
  for (const [field, re] of Object.entries(patterns)) {
    const m = out.match(re);
    if (m) current[field] = m[1];
  }
  current.deployedAt = new Date().toISOString();
  delete current.deployNote;
  writeFileSync(addressesPath, JSON.stringify(current, null, 2) + "\n");
  console.log("Updated", addressesPath);
} catch (e) {
  console.error(e.stdout ?? e.message);
  process.exit(1);
}