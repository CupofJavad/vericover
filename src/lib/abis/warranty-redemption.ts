export const warrantyRedemptionAbi = [
  {
    type: "function",
    name: "redeem",
    stateMutability: "nonpayable",
    inputs: [
      { name: "claimCodeHash", type: "bytes32" },
      { name: "serial", type: "string" },
      { name: "metadataURI", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    type: "function",
    name: "usedClaimCodes",
    stateMutability: "view",
    inputs: [{ name: "claimCodeHash", type: "bytes32" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "computeSerialHash",
    stateMutability: "pure",
    inputs: [
      { name: "serial", type: "string" },
      { name: "skuHash", type: "bytes32" },
    ],
    outputs: [{ type: "bytes32" }],
  },
] as const;