#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, http, formatEther } from "viem";
import { baseSepolia } from "viem/chains";

const __dirname = dirname(fileURLToPath(import.meta.url));
const deployed = JSON.parse(
  readFileSync(join(__dirname, "../src/lib/deployed-addresses.json"), "utf8")
);

const rpc = process.env.BASE_SEPOLIA_RPC ?? "https://sepolia.base.org";
const client = createPublicClient({ chain: baseSepolia, transport: http(rpc) });

const addr = deployed.deployer;
const balance = await client.getBalance({ address: addr });
const eth = formatEther(balance);

console.log(`Deployer: ${addr}`);
console.log(`Balance:  ${eth} ETH`);
console.log(`On-chain: ${deployed.deployedAt ? "ACTIVE" : "demo mode (deployedAt null)"}`);

if (balance === 0n) {
  console.log("\nFund this address, then run:");
  console.log("  DEPLOYER_PRIVATE_KEY=0x... npm run deploy:warranties");
  process.exit(1);
}