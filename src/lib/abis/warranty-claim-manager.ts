export const warrantyClaimManagerAbi = [
  {
    type: "function",
    name: "submitClaim",
    stateMutability: "nonpayable",
    inputs: [
      { name: "passportId", type: "uint256" },
      { name: "claimType", type: "uint8" },
      { name: "requestedAmount", type: "uint256" },
      { name: "evidenceURI", type: "string" },
    ],
    outputs: [{ name: "claimId", type: "uint256" }],
  },
] as const;

export const claimTypeOnChain = {
  repair: 0,
  replace: 1,
  refund: 2,
} as const;