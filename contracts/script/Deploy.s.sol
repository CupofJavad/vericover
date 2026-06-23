// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {ProductPassport721} from "../src/ProductPassport721.sol";
import {WarrantyRegistry} from "../src/WarrantyRegistry.sol";
import {WarrantyClaimManager} from "../src/WarrantyClaimManager.sol";
import {WarrantyTrancheVault} from "../src/WarrantyTrancheVault.sol";
import {WarrantyRedemption} from "../src/WarrantyRedemption.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Deploy VeriCover warranty rail to Base Sepolia
/// forge script script/Deploy.s.sol:Deploy --rpc-url $BASE_SEPOLIA_RPC --broadcast -vvvv
contract Deploy is Script {
    address constant USDC_BASE_SEPOLIA = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    bytes32 constant MFR_NOVATECH = keccak256("mfr-novatech");
    bytes32 constant MFR_SOUNDFORGE = keccak256("mfr-soundforge");

    bytes32 constant SKU_LAPTOP = keccak256("VC-LAP-15");
    bytes32 constant SKU_PHONE = keccak256("VC-PHN-X2");
    bytes32 constant SKU_EARBUDS = keccak256("VC-AUD-P3");

    bytes32 constant CODE_LAPTOP = keccak256("VERI-LAPTOP-2026-A1");
    bytes32 constant CODE_PHONE = keccak256("VERI-PHONE-2026-B2");
    bytes32 constant CODE_EARBUDS = keccak256("VERI-EARBUDS-2026-C3");

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        ProductPassport721 passport = new ProductPassport721(deployer);
        WarrantyRegistry registry = new WarrantyRegistry(deployer);
        WarrantyClaimManager claimManager =
            new WarrantyClaimManager(deployer, address(passport));
        WarrantyRedemption redemption =
            new WarrantyRedemption(deployer, address(passport), address(registry));

        WarrantyTrancheVault novaVault = new WarrantyTrancheVault(
            IERC20(USDC_BASE_SEPOLIA),
            MFR_NOVATECH,
            "NovaTech Warranty Tranche",
            deployer,
            address(claimManager)
        );

        WarrantyTrancheVault soundVault = new WarrantyTrancheVault(
            IERC20(USDC_BASE_SEPOLIA),
            MFR_SOUNDFORGE,
            "SoundForge Warranty Tranche",
            deployer,
            address(claimManager)
        );

        registry.registerManufacturer(MFR_NOVATECH, "NovaTech Industries");
        registry.registerManufacturer(MFR_SOUNDFORGE, "SoundForge Labs");
        registry.grantManufacturerRole(deployer);
        registry.linkTrancheVault(MFR_NOVATECH, address(novaVault));
        registry.linkTrancheVault(MFR_SOUNDFORGE, address(soundVault));

        passport.grantRole(passport.MINTER_ROLE(), address(redemption));

        _registerDemoSerial(registry, "NT-LAP-2026-0001842", SKU_LAPTOP, MFR_NOVATECH);
        _registerDemoSerial(registry, "NT-PHN-2026-0002910", SKU_PHONE, MFR_NOVATECH);
        _registerDemoSerial(registry, "SF-AUD-2026-0000441", SKU_EARBUDS, MFR_SOUNDFORGE);

        redemption.configureClaimCode(
            CODE_LAPTOP, MFR_NOVATECH, SKU_LAPTOP, 730 days, keccak256("terms-laptop-v1")
        );
        redemption.configureClaimCode(
            CODE_PHONE, MFR_NOVATECH, SKU_PHONE, 365 days, keccak256("terms-phone-v1")
        );
        redemption.configureClaimCode(
            CODE_EARBUDS, MFR_SOUNDFORGE, SKU_EARBUDS, 180 days, keccak256("terms-audio-v1")
        );

        vm.stopBroadcast();

        console2.log("ProductPassport721", address(passport));
        console2.log("WarrantyRegistry", address(registry));
        console2.log("WarrantyClaimManager", address(claimManager));
        console2.log("WarrantyRedemption", address(redemption));
        console2.log("NovaTechVault", address(novaVault));
        console2.log("SoundForgeVault", address(soundVault));
    }

    function _registerDemoSerial(
        WarrantyRegistry registry,
        string memory serial,
        bytes32 skuHash,
        bytes32 manufacturerId
    ) internal {
        bytes32 serialHash = keccak256(abi.encodePacked(serial, skuHash, "vericover-v1"));
        registry.registerSerial(serialHash, manufacturerId);
    }
}