// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title ProductPassport721
/// @notice ERC-721 digital product passport — separate from parametric Policy NFTs (ADR-007)
contract ProductPassport721 is ERC721, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct PassportData {
        bytes32 serialHash;
        bytes32 manufacturerId;
        uint64 warrantyStart;
        uint64 warrantyEnd;
        bytes32 termsHash;
        string metadataURI;
    }

    uint256 private _nextTokenId = 1;
    mapping(uint256 => PassportData) public passports;
    mapping(bytes32 => uint256) public serialToTokenId;

    event PassportMinted(
        uint256 indexed tokenId,
        address indexed owner,
        bytes32 indexed serialHash,
        bytes32 manufacturerId
    );

    constructor(address admin) ERC721("VeriCover Product Passport", "VCPASS") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mintPassport(
        address to,
        bytes32 serialHash,
        bytes32 manufacturerId,
        uint64 warrantyStart,
        uint64 warrantyEnd,
        bytes32 termsHash,
        string calldata metadataURI
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        require(serialToTokenId[serialHash] == 0, "Serial already registered");
        require(warrantyEnd > warrantyStart, "Invalid warranty window");

        tokenId = _nextTokenId++;
        serialToTokenId[serialHash] = tokenId;
        passports[tokenId] = PassportData({
            serialHash: serialHash,
            manufacturerId: manufacturerId,
            warrantyStart: warrantyStart,
            warrantyEnd: warrantyEnd,
            termsHash: termsHash,
            metadataURI: metadataURI
        });

        _safeMint(to, tokenId);
        emit PassportMinted(tokenId, to, serialHash, manufacturerId);
    }

    function isWarrantyActive(uint256 tokenId) external view returns (bool) {
        PassportData memory p = passports[tokenId];
        return block.timestamp >= p.warrantyStart && block.timestamp <= p.warrantyEnd;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}