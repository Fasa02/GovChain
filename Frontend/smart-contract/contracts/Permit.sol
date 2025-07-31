// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyNFT is ERC721URIStorage {
    uint256 private _nextTokenId;

    constructor() ERC721("MyNFT", "MNFT") {}

    function safeMint(address to) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        // Set URI di sini (otomatis format URL/tokenId.json)
        string memory uri = string(abi.encodePacked("http://localhost:3000/metadata/", Strings.toString(tokenId), ".json"));
        _setTokenURI(tokenId, uri);
    }
}
