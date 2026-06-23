// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title WarrantyRegistry
/// @notice Manufacturer onboarding and serial pre-registration before consumer mint
contract WarrantyRegistry is AccessControl {
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");

    struct Manufacturer {
        string name;
        bool active;
        address trancheVault;
    }

    mapping(bytes32 => Manufacturer) public manufacturers;
    mapping(bytes32 => bool) public registeredSerials;
    mapping(bytes32 => bytes32) public serialToManufacturer;

    event ManufacturerRegistered(bytes32 indexed manufacturerId, string name);
    event SerialRegistered(bytes32 indexed serialHash, bytes32 indexed manufacturerId);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function registerManufacturer(bytes32 manufacturerId, string calldata name)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(!manufacturers[manufacturerId].active, "Already registered");
        manufacturers[manufacturerId] = Manufacturer({name: name, active: true, trancheVault: address(0)});
        _grantRole(MANUFACTURER_ROLE, msg.sender);
        emit ManufacturerRegistered(manufacturerId, name);
    }

    function linkTrancheVault(bytes32 manufacturerId, address vault)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(manufacturers[manufacturerId].active, "Unknown manufacturer");
        manufacturers[manufacturerId].trancheVault = vault;
    }

    function registerSerial(bytes32 serialHash, bytes32 manufacturerId)
        external
        onlyRole(MANUFACTURER_ROLE)
    {
        require(manufacturers[manufacturerId].active, "Unknown manufacturer");
        require(!registeredSerials[serialHash], "Serial exists");
        registeredSerials[serialHash] = true;
        serialToManufacturer[serialHash] = manufacturerId;
        emit SerialRegistered(serialHash, manufacturerId);
    }

    function isSerialRegistered(bytes32 serialHash) external view returns (bool) {
        return registeredSerials[serialHash];
    }
}