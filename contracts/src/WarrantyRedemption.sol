// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ProductPassport721} from "./ProductPassport721.sol";
import {WarrantyRegistry} from "./WarrantyRegistry.sol";

/// @title WarrantyRedemption
/// @notice Consumer-facing claim-code redemption → Product Passport mint
contract WarrantyRedemption is AccessControl {
    ProductPassport721 public immutable passport;
    WarrantyRegistry public immutable registry;

    struct ClaimCodeConfig {
        bytes32 manufacturerId;
        bytes32 skuHash;
        uint64 warrantyDuration;
        bytes32 termsHash;
        bool active;
    }

    mapping(bytes32 => ClaimCodeConfig) public claimCodes;
    mapping(bytes32 => bool) public usedClaimCodes;

    event ClaimCodeConfigured(bytes32 indexed claimCodeHash, bytes32 manufacturerId);
    event PassportRedeemed(
        uint256 indexed tokenId,
        address indexed owner,
        bytes32 indexed claimCodeHash,
        bytes32 serialHash
    );

    constructor(address admin, address passportAddress, address registryAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        passport = ProductPassport721(passportAddress);
        registry = WarrantyRegistry(registryAddress);
    }

    function configureClaimCode(
        bytes32 claimCodeHash,
        bytes32 manufacturerId,
        bytes32 skuHash,
        uint64 warrantyDuration,
        bytes32 termsHash
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        claimCodes[claimCodeHash] = ClaimCodeConfig({
            manufacturerId: manufacturerId,
            skuHash: skuHash,
            warrantyDuration: warrantyDuration,
            termsHash: termsHash,
            active: true
        });
        emit ClaimCodeConfigured(claimCodeHash, manufacturerId);
    }

    function computeSerialHash(string calldata serial, bytes32 skuHash)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(serial, skuHash, "vericover-v1"));
    }

    function redeem(
        bytes32 claimCodeHash,
        string calldata serial,
        string calldata metadataURI
    ) external returns (uint256 tokenId) {
        ClaimCodeConfig memory cfg = claimCodes[claimCodeHash];
        require(cfg.active, "Invalid claim code");
        require(!usedClaimCodes[claimCodeHash], "Claim code used");

        bytes32 serialHash = computeSerialHash(serial, cfg.skuHash);
        require(registry.isSerialRegistered(serialHash), "Serial not registered");
        require(
            registry.serialToManufacturer(serialHash) == cfg.manufacturerId,
            "Serial manufacturer mismatch"
        );

        usedClaimCodes[claimCodeHash] = true;
        uint64 start = uint64(block.timestamp);
        uint64 end = start + cfg.warrantyDuration;

        tokenId = passport.mintPassport(
            msg.sender,
            serialHash,
            cfg.manufacturerId,
            start,
            end,
            cfg.termsHash,
            metadataURI
        );

        emit PassportRedeemed(tokenId, msg.sender, claimCodeHash, serialHash);
    }
}