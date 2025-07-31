async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const MyNFT = await ethers.getContractFactory("MyNFT"); // Pastikan ini nama kontraknya
  const contract = await MyNFT.deploy();

  console.log("✅ Waiting for contract to be mined...");
  await contract.waitForDeployment(); // ini untuk Hardhat versi 2.17+ (Ethers v6)
  
  const address = await contract.getAddress(); // ambil address-nya
  console.log("✅ Contract deployed to:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
