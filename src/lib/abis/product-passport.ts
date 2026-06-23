export const productPassportAbi = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "passports",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { name: "serialHash", type: "bytes32" },
      { name: "manufacturerId", type: "bytes32" },
      { name: "warrantyStart", type: "uint64" },
      { name: "warrantyEnd", type: "uint64" },
      { name: "termsHash", type: "bytes32" },
      { name: "metadataURI", type: "string" },
    ],
  },
  {
    type: "function",
    name: "serialToTokenId",
    stateMutability: "view",
    inputs: [{ name: "serialHash", type: "bytes32" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "isWarrantyActive",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
] as const;