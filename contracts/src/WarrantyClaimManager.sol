// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ProductPassport721} from "./ProductPassport721.sol";

/// @title WarrantyClaimManager
/// @notice Discretionary repair / replace / refund state machine — not parametric
contract WarrantyClaimManager is AccessControl {
    bytes32 public constant REVIEWER_ROLE = keccak256("REVIEWER_ROLE");

    enum ClaimType {
        Repair,
        Replace,
        Refund
    }

    enum ClaimStatus {
        Submitted,
        UnderReview,
        Approved,
        Rejected,
        Paid
    }

    struct Claim {
        uint256 passportId;
        address claimant;
        ClaimType claimType;
        ClaimStatus status;
        uint256 requestedAmount;
        uint256 approvedAmount;
        string evidenceURI;
        uint64 submittedAt;
        uint64 resolvedAt;
    }

    ProductPassport721 public immutable passport;
    uint256 public nextClaimId = 1;
    mapping(uint256 => Claim) public claims;
    mapping(uint256 => uint256[]) public passportClaims;

    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed passportId, address claimant);
    event ClaimResolved(uint256 indexed claimId, ClaimStatus status, uint256 approvedAmount);

    constructor(address admin, address passportAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REVIEWER_ROLE, admin);
        passport = ProductPassport721(passportAddress);
    }

    function submitClaim(
        uint256 passportId,
        ClaimType claimType,
        uint256 requestedAmount,
        string calldata evidenceURI
    ) external returns (uint256 claimId) {
        require(passport.ownerOf(passportId) == msg.sender, "Not passport owner");
        require(passport.isWarrantyActive(passportId), "Warranty expired");
        require(requestedAmount > 0, "Invalid amount");

        claimId = nextClaimId++;
        claims[claimId] = Claim({
            passportId: passportId,
            claimant: msg.sender,
            claimType: claimType,
            status: ClaimStatus.Submitted,
            requestedAmount: requestedAmount,
            approvedAmount: 0,
            evidenceURI: evidenceURI,
            submittedAt: uint64(block.timestamp),
            resolvedAt: 0
        });
        passportClaims[passportId].push(claimId);
        emit ClaimSubmitted(claimId, passportId, msg.sender);
    }

    function reviewClaim(uint256 claimId, ClaimStatus newStatus, uint256 approvedAmount)
        external
        onlyRole(REVIEWER_ROLE)
    {
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.Submitted || c.status == ClaimStatus.UnderReview, "Not reviewable");
        require(
            newStatus == ClaimStatus.UnderReview
                || newStatus == ClaimStatus.Approved
                || newStatus == ClaimStatus.Rejected,
            "Invalid transition"
        );
        c.status = newStatus;
        if (newStatus == ClaimStatus.Approved || newStatus == ClaimStatus.Rejected) {
            c.approvedAmount = approvedAmount;
            c.resolvedAt = uint64(block.timestamp);
        }
        emit ClaimResolved(claimId, newStatus, approvedAmount);
    }

    function markPaid(uint256 claimId) external onlyRole(REVIEWER_ROLE) {
        Claim storage c = claims[claimId];
        require(c.status == ClaimStatus.Approved, "Must be approved");
        c.status = ClaimStatus.Paid;
        c.resolvedAt = uint64(block.timestamp);
        emit ClaimResolved(claimId, ClaimStatus.Paid, c.approvedAmount);
    }
}