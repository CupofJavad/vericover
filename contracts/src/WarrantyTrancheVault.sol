// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title WarrantyTrancheVault
/// @notice Per-manufacturer ERC-4626 vault — isolated from parametric insurance LP pool
contract WarrantyTrancheVault is ERC4626, AccessControl {
    bytes32 public constant PAYOUT_ROLE = keccak256("PAYOUT_ROLE");

    bytes32 public immutable manufacturerId;
    uint256 public totalClaimsPaid;

    event ClaimPayout(uint256 amount, address recipient);

    constructor(
        IERC20 asset,
        bytes32 mfrId,
        string memory name,
        address admin,
        address claimManager
    ) ERC4626(asset) ERC20(name, "VCWARR") {
        manufacturerId = mfrId;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAYOUT_ROLE, claimManager);
    }

    function payClaim(address recipient, uint256 amount) external onlyRole(PAYOUT_ROLE) {
        require(amount <= totalAssets(), "Insufficient tranche liquidity");
        totalClaimsPaid += amount;
        IERC20(asset()).transfer(recipient, amount);
        emit ClaimPayout(amount, recipient);
    }
}