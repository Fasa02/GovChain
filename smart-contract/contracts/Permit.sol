// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Permit is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(string => uint256) private _hashToTokenId;
    
    constructor() ERC721("GovChain Permit", "GCP") {}

    function mintPermit(address to, string memory uri) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);

        _hashToTokenId[uri] = newTokenId;
        
        return newTokenId;
    }

    function getTokenIdByHash(string memory hash) public view returns (uint256) {
        require(_hashToTokenId[hash] != 0, "Hash not found");
        return _hashToTokenId[hash];
    }

    function burnPermit(uint256 tokenId) public {
        require(_exists(tokenId), "Token tidak ditemukan");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Bukan pemilik atau disetujui");
        _burn(tokenId);
    }

    function totalMinted() public view returns (uint256) {
        return _tokenIds.current();
    }

    function permitsOf(address owner) public view returns (uint256[] memory) {
        uint256 total = totalMinted();
        uint256[] memory result = new uint256[](total);
        uint256 counter = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                result[counter] = i;
                counter++;
            }
        }

        // Resize the result array
        uint256[] memory finalResult = new uint256[](counter);
        for (uint256 i = 0; i < counter; i++) {
            finalResult[i] = result[i];
        }
        return finalResult;
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
