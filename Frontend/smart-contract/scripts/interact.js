const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // sesuaikan
  const MyNFT = await ethers.getContractAt("MyNFT", contractAddress);

  const [signer] = await ethers.getSigners();

  console.log("Mencetak NFT untuk:", signer.address);
  const tx = await MyNFT.safeMint(signer.address);
  await tx.wait();

  console.log("✅ NFT dicetak dengan tokenId = 1");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
