// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ProductPassport721} from "../src/ProductPassport721.sol";
import {WarrantyRegistry} from "../src/WarrantyRegistry.sol";
import {WarrantyClaimManager} from "../src/WarrantyClaimManager.sol";

contract WarrantyTest is Test {
    ProductPassport721 passport;
    WarrantyRegistry registry;
    WarrantyClaimManager claimManager;

    address admin = address(1);
    address consumer = address(2);
    bytes32 serial = keccak256("SN-001");
    bytes32 mfrId = keccak256("mfr-novatech");

    function setUp() public {
        passport = new ProductPassport721(admin);
        registry = new WarrantyRegistry(admin);
        claimManager = new WarrantyClaimManager(admin, address(passport));

        vm.startPrank(admin);
        registry.registerManufacturer(mfrId, "NovaTech");
        registry.registerSerial(serial, mfrId);
        passport.grantRole(passport.MINTER_ROLE(), admin);
        vm.stopPrank();
    }

    function test_mintPassport_serialUniqueness() public {
        vm.prank(admin);
        uint256 id = passport.mintPassport(
            consumer,
            serial,
            mfrId,
            uint64(block.timestamp),
            uint64(block.timestamp + 365 days),
            keccak256("terms"),
            "ipfs://meta"
        );
        assertEq(passport.ownerOf(id), consumer);
        assertTrue(passport.isWarrantyActive(id));

        vm.prank(admin);
        vm.expectRevert("Serial already registered");
        passport.mintPassport(
            consumer,
            serial,
            mfrId,
            uint64(block.timestamp),
            uint64(block.timestamp + 365 days),
            keccak256("terms"),
            "ipfs://meta2"
        );
    }

    function test_submitClaim_requiresOwner() public {
        vm.prank(admin);
        uint256 id = passport.mintPassport(
            consumer,
            serial,
            mfrId,
            uint64(block.timestamp),
            uint64(block.timestamp + 365 days),
            keccak256("terms"),
            "ipfs://meta"
        );

        vm.prank(consumer);
        uint256 claimId = claimManager.submitClaim(
            id,
            WarrantyClaimManager.ClaimType.Repair,
            100e6,
            "ipfs://evidence"
        );
        assertEq(uint256(claimManager.claims(claimId).status), uint256(WarrantyClaimManager.ClaimStatus.Submitted));
    }
}