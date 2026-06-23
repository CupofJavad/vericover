#!/usr/bin/env node
/**
 * Fund the warranty deployer on Base Sepolia.
 *
 * Option A — CDP Faucets API (programmatic, no browser):
 *   1. Create API key: https://portal.cdp.coinbase.com/projects/api-keys
 *   2. Generate wallet secret: https://portal.cdp.coinbase.com/wallets/non-custodial/security
 *   3. Set env vars and run:
 *      CDP_API_KEY_ID=... CDP_API_KEY_SECRET=... CDP_WALLET_SECRET=... npm run fund:deployer
 *
 * Option B — Manual faucets (no API keys):
 *   npm run fund:deployer -- --links
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, http, formatEther } from "viem";
import { baseSepolia } from "viem/chains";

const __dirname = dirname(fileURLToPath(import.meta.url));
const deployed = JSON.parse(
  readFileSync(join(__dirname, "../src/lib/deployed-addresses.json"), "utf8")
);

const DEPLOYER = deployed.deployer;
const RPC = process.env.BASE_SEPOLIA_RPC ?? "https://sepolia.base.org";

const MANUAL_FAUCETS = [
  ["Alchemy", "https://www.alchemy.com/faucets/base-sepolia"],
  ["thirdweb", "https://thirdweb.com/base-sepolia-testnet"],
  ["Coinbase CDP", "https://portal.cdp.coinbase.com/products/faucet"],
  ["Chainlink (needs 1 LINK mainnet)", "https://faucets.chain.link/base-sepolia"],
  ["Ethereum Ecosystem", "https://www.ethereum-ecosystem.com/faucets/base-sepolia"],
  ["QuickNode", "https://faucet.quicknode.com/base/sepolia"],
  ["GetBlock", "https://getblock.io/faucet/base-sepolia/"],
  ["Coinbase CDP (UI)", "https://portal.cdp.coinbase.com/products/faucet"],
];

async function getBalance() {
  const client = createPublicClient({ chain: baseSepolia, transport: http(RPC) });
  return client.getBalance({ address: DEPLOYER });
}

function printLinks() {
  console.log(`\nDeployer: ${DEPLOYER}`);
  console.log("Paste this address into any Base Sepolia faucet:\n");
  for (const [name, url] of MANUAL_FAUCETS) {
    console.log(`  ${name.padEnd(22)} ${url}`);
  }
  console.log("\nAfter funding, verify: npm run deploy:check");
  console.log("Then deploy:       DEPLOYER_PRIVATE_KEY=0x... npm run deploy:warranties\n");
}

async function fundViaCdp() {
  const { CdpClient } = await import("@coinbase/cdp-sdk");
  const cdp = new CdpClient();
  const response = await cdp.evm.requestFaucet({
    address: DEPLOYER,
    network: "base-sepolia",
    token: "eth",
  });
  const hash = response.transactionHash;
  console.log(`CDP faucet tx: https://sepolia.basescan.org/tx/${hash}`);
  return hash;
}

async function main() {
  const showLinks = process.argv.includes("--links");
  const balance = await getBalance();

  console.log(`Deployer: ${DEPLOYER}`);
  console.log(`Balance:  ${formatEther(balance)} ETH`);

  if (balance > 0n) {
    console.log("Deployer already funded. Run: npm run deploy:warranties");
    return;
  }

  if (showLinks) {
    printLinks();
    return;
  }

  const hasCdp =
    process.env.CDP_API_KEY_ID &&
    process.env.CDP_API_KEY_SECRET &&
    process.env.CDP_WALLET_SECRET;

  if (!hasCdp) {
    console.log("\nNo CDP API credentials found.");
    printLinks();
    console.log(
      "Tip: set CDP_API_KEY_ID, CDP_API_KEY_SECRET, CDP_WALLET_SECRET for programmatic funding."
    );
    process.exit(1);
  }

  console.log("\nRequesting ETH via CDP Faucets API...");
  await fundViaCdp();

  // Poll balance for up to 60s
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const updated = await getBalance();
    if (updated > 0n) {
      console.log(`Funded: ${formatEther(updated)} ETH`);
      console.log("Next: DEPLOYER_PRIVATE_KEY=0x... npm run deploy:warranties");
      return;
    }
  }

  console.log("Faucet tx submitted — balance not updated yet. Check Basescan and retry deploy:check.");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});