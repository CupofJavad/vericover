import fs from "fs";
import path from "path";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";

const outDir = path.join(process.cwd(), "docs", "warranty-extension");
fs.mkdirSync(outDir, { recursive: true });

function h(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { after: 200 } });
}

function p(text, bold = false) {
  return new Paragraph({
    children: [new TextRun({ text, bold })],
    spacing: { after: 120 },
  });
}

function disclaimer() {
  return p(
    "Regulatory disclaimer: VeriCover provides on-chain warranty and risk-sharing infrastructure. It is not a licensed insurance company or traditional warranty insurer in all jurisdictions. Manufacturers remain primary obligors for statutory warranties where applicable.",
    true
  );
}

// 1. Architecture & ADR doc
const archDoc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        h("VeriCover Digital Warranties — Architecture & ADR"),
        p("Owner: Javad (@Zarathustra_F) · Branch: feature/digital-warranties · June 2026"),
        disclaimer(),
        h("ADR-007 Decision Summary", HeadingLevel.HEADING_2),
        p("Separate ProductPassport721 from Policy NFT. Manufacturer-funded WarrantyTrancheVault per brand. Discretionary claim path for repair/replace/refund. Parametric insurance rail unchanged."),
        h("Physical Product Linking", HeadingLevel.HEADING_2),
        p("• serialHash = keccak256(serial + sku + batch) registered by manufacturer"),
        p("• QR code → public product passport viewer (IPFS metadata)"),
        p("• Claim code / NFC → mint Passport NFT to consumer wallet"),
        p("• warrantyStart, warrantyEnd, termsHash stored on-chain"),
        h("Financial Model", HeadingLevel.HEADING_2),
        p("• Manufacturer deposits USDC into dedicated tranche (ERC-4626 sub-vault)"),
        p("• Warranty fee at issuance: 100% to manufacturer tranche (no parametric LP share)"),
        p("• Claims draw manufacturer tranche first; optional protocol backstop capped at 5%"),
        p("• Insurance premiums continue flowing to existing InsuranceTranche only"),
        h("Transferability", HeadingLevel.HEADING_2),
        p("Passports transferable by default (second-hand market). warrantyEnd unchanged on transfer. Optional maxTransfers per SKU. ERC-5192 lock during open claims only."),
        h("Fraud Prevention", HeadingLevel.HEADING_2),
        p("• One serial = one passport (duplicate reverts)"),
        p("• Evidence hash on IPFS; authorized service provider attestations (EAS Phase 2)"),
        p("• Auto-approve only below threshold with allowlisted defect codes"),
        p("• Multisig / optimistic challenge window for high-value claims"),
      ],
    },
  ],
});

// 2. Smart contract spec
const contractDoc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        h("Warranty Module — Smart Contract Specification"),
        p("Owner: Javad · VeriCover · MVP Phase 1"),
        h("ProductPassport721.sol", HeadingLevel.HEADING_2),
        p("mintPassport(serialHash, skuHash, warrantyEnd, termsHash, manufacturerId) — MANUFACTURER_ROLE"),
        p("transferFrom — standard ERC-721; increments transferCount; blocked if claimLocked"),
        p("linkExtendedPolicy(passportId, policyTokenId) — optional insurance link"),
        p("Views: getPassport(tokenId), isWarrantyActive(tokenId), serialHashUsed(serialHash)"),
        h("WarrantyRegistry.sol", HeadingLevel.HEADING_2),
        p("registerManufacturer(), registerSerial(), flagRecalled(), flagStolen()"),
        p("Roles: MANUFACTURER_ROLE, OPERATOR_ROLE, PAUSER_ROLE"),
        h("WarrantyClaimManager.sol", HeadingLevel.HEADING_2),
        p("submitClaim(passportId, claimType, defectCode, evidenceHash, amount)"),
        p("approveClaim(claimId) / rejectClaim(claimId) — adjudicator or auto-rules"),
        p("executePayout(claimId) → WarrantyTrancheVault.pay(serviceProvider | owner)"),
        p("ClaimType enum: REPAIR, REPLACE, REFUND"),
        p("ClaimStatus: SUBMITTED → ELIGIBLE → APPROVED → PAID | REJECTED"),
        h("WarrantyTrancheVault.sol", HeadingLevel.HEADING_2),
        p("ERC-4626 per manufacturerId. deposit(), withdraw() with lock rules."),
        p("reserveForClaim(), payClaim() — only ClaimManager"),
        p("Invariant: totalAssets >= reservedClaims + pendingPayouts"),
        h("Integration with existing contracts", HeadingLevel.HEADING_2),
        p("PolicyNFT.sol — add optional passportId field (zero = insurance-only)"),
        p("ReservePoolCoordinator.sol — routes premiums/claims by ProductType INSURANCE | WARRANTY"),
        p("No changes to ParametricEngine.sol or OracleRegistry.sol for warranty MVP"),
      ],
    },
  ],
});

// 3. User flows
const flowsDoc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        h("Digital Warranties — User Flows"),
        p("Owner: Javad · VeriCover"),
        h("Manufacturer / Retailer — Issue Warranty", HeadingLevel.HEADING_2),
        p("1. Register as manufacturer (KYC off-chain, on-chain role grant)"),
        p("2. Deposit USDC into WarrantyTrancheVault"),
        p("3. Bulk-register serial hashes for SKU batch"),
        p("4. Print QR (DPP viewer) + claim code on packaging"),
        p("5. Consumer scans → mints ProductPassport721 → warranty active"),
        h("Consumer — Register & Claim", HeadingLevel.HEADING_2),
        p("1. Scan QR or enter claim code"),
        p("2. Connect wallet on Base → receive Passport NFT"),
        p("3. If defect: submit claim with photos (IPFS) + defect category"),
        p("4. Auto or manual review → payout / repair authorization"),
        p("5. Full history visible in app + block explorer"),
        h("Consumer — Resell Product", HeadingLevel.HEADING_2),
        p("1. Transfer Passport NFT to buyer (wallet-to-wallet or marketplace)"),
        p("2. Remaining warranty time unchanged"),
        p("3. Repair history attestations travel with passport"),
        h("Authorized Service Provider", HeadingLevel.HEADING_2),
        p("1. Submit repair attestation with cost and parts"),
        p("2. Claim manager validates → partial payout from tranche"),
      ],
    },
  ],
});

// 4. Use cases
const useCasesDoc = new Document({
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        h("Real-World Warranty Use Cases"),
        p("VeriCover — Founded by Javad"),
        ...[
          ["Consumer electronics", "Smartphones, laptops — 12–24mo defect cover, transferable resale"],
          ["Home appliances", "Washers, fridges — repair/replace; serial-linked recalls"],
          ["Luxury goods", "Watches, handbags — authenticity + warranty card on-chain (Breitling-style)"],
          ["Power tools", "Contractor equipment — repair history increases resale value"],
          ["E-bikes / EV accessories", "Battery passport alignment (EU 2027 batteries)"],
          ["Retail extended warranty", "Retailer sells extension → links optional Policy NFT"],
        ].flatMap(([title, desc]) => [h(title, HeadingLevel.HEADING_2), p(desc)]),
        disclaimer(),
      ],
    },
  ],
});

const files = [
  ["VeriCover-Warranty-Architecture-ADR.docx", archDoc],
  ["VeriCover-Warranty-Smart-Contract-Spec.docx", contractDoc],
  ["VeriCover-Warranty-User-Flows.docx", flowsDoc],
  ["VeriCover-Warranty-Use-Cases.docx", useCasesDoc],
];

for (const [name, doc] of files) {
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(outDir, name), buf);
  console.log("Wrote", name);
}