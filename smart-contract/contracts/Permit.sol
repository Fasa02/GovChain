// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Permit is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    constructor() ERC721("GovChain Permit", "GCP") {}

    function mintPermit(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function burnPermit(uint256 tokenId) public {
        require(super._exists(tokenId), "Token tidak ditemukan");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Bukan pemilik atau disetujui");
        _burn(tokenId);
    }

    function totalMinted() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    function permitsOf(address owner) public view returns (uint256[] memory) {
        uint256 total = totalMinted();
        uint256[] memory result = new uint256[](total);
        uint256 counter = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (super._exists(i) && ownerOf(i) == owner) {
                result[counter] = i;
                counter++;
            }
        }

        // Resize the result array
        bytes memory encoded = abi.encode(result);
        assembly {
            mstore(add(encoded, 0x40), counter)
        }
        return abi.decode(encoded, (uint256[]));
    }

    // OVERRIDES YANG DIPERLUKAN UNTUK MULTI-INHERITANCE
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
