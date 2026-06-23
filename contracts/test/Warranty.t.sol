// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ProductPassport721} from "../src/ProductPassport721.sol";
import {WarrantyRegistry} from "../src/WarrantyRegistry.sol";
import {WarrantyClaimManager} from "../src/WarrantyClaimManager.sol";
import {WarrantyRedemption} from "../src/WarrantyRedemption.sol";

contract WarrantyTest is Test {
    ProductPassport721 passport;
    WarrantyRegistry registry;
    WarrantyClaimManager claimManager;
    WarrantyRedemption redemption;

    address admin = address(1);
    address consumer = address(2);
    bytes32 mfrId = keccak256("mfr-novatech");
    bytes32 skuHash = keccak256("VC-LAP-15");
    bytes32 claimCode = keccak256("VERI-LAPTOP-2026-A1");
    string serial = "NT-LAP-2026-0001842";

    function setUp() public {
        passport = new ProductPassport721(admin);
        registry = new WarrantyRegistry(admin);
        claimManager = new WarrantyClaimManager(admin, address(passport));
        redemption = new WarrantyRedemption(admin, address(passport), address(registry));

        vm.startPrank(admin);
        registry.registerManufacturer(mfrId, "NovaTech");
        registry.grantManufacturerRole(admin);
        bytes32 serialHash = redemption.computeSerialHash(serial, skuHash);
        registry.registerSerial(serialHash, mfrId);
        passport.grantRole(passport.MINTER_ROLE(), address(redemption));
        redemption.configureClaimCode(
            claimCode, mfrId, skuHash, 730 days, keccak256("terms")
        );
        vm.stopPrank();
    }

    function test_redeemClaimCode_mintsPassport() public {
        vm.prank(consumer);
        uint256 id = redemption.redeem(claimCode, serial, "ipfs://meta");
        assertEq(passport.ownerOf(id), consumer);
        assertTrue(passport.isWarrantyActive(id));
        assertTrue(redemption.usedClaimCodes(claimCode));
    }

    function test_redeemClaimCode_rejectsReuse() public {
        vm.prank(consumer);
        redemption.redeem(claimCode, serial, "ipfs://meta");

        vm.prank(address(3));
        vm.expectRevert("Claim code used");
        redemption.redeem(claimCode, "NT-LAP-2026-0009999", "ipfs://meta2");
    }

    function test_submitClaim_requiresOwner() public {
        vm.prank(consumer);
        uint256 id = redemption.redeem(claimCode, serial, "ipfs://meta");

        vm.prank(consumer);
        uint256 claimId = claimManager.submitClaim(
            id,
            WarrantyClaimManager.ClaimType.Repair,
            100e6,
            "ipfs://evidence"
        );
        (
            ,
            ,
            ,
            WarrantyClaimManager.ClaimStatus status,
            ,
            ,
            ,
            ,
        ) = claimManager.claims(claimId);
        assertEq(uint256(status), uint256(WarrantyClaimManager.ClaimStatus.Submitted));
    }
}