# GovChain Permit - Smart Contract

GovChain Permit adalah smart contract berbasis Ethereum yang memungkinkan pemerintah atau otoritas berwenang untuk menerbitkan **NFT izin atau sertifikat** sebagai bukti kepemilikan atau legalitas suatu dokumen. Smart contract ini dibangun menggunakan framework **Hardhat** dan library **OpenZeppelin**.

---

## Fitur Utama

- **Mint NFT** sebagai izin resmi (permit)
- Validasi pemilik dan otoritas terotorisasi
- Pemerintah yang berwenang saja yang bisa menerbitkan izin
- Verifikasi dokumen berdasarkan hash
- Revoke/delete NFT permit oleh pemilik & pemerintah

---

## Struktur Kontrak

- **`Permit.sol`**
  - Inherits from: `ERC721`, `ERC721URIStorage`, `Ownable`
  - Fungsi:
    - `mintPermit(address to, string memory tokenURI, string memory docHash)`: Menerbitkan izin dalam bentuk NFT
    - `getPermitByHash(string memory docHash)`: Mencari tokenId berdasarkan hash dokumen
    - `revokePermit(uint256 tokenId)`: Menghapus izin oleh pemilik atau yang disetujui
    - `addAuthorizedGovernment(address addr)`: Menambah alamat pemerintah yang diotorisasi
    - `isAuthorizedGovernment(address addr)`: Mengecek apakah suatu alamat adalah otoritas
    - Override fungsi `tokenURI`, `_burn`, dan lainnya untuk kompatibilitas
