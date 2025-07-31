const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying GovChain Permit Smart Contract...");

  const Permit = await hre.ethers.getContractFactory("Permit");
  const permit = await Permit.deploy();

  await permit.waitForDeployment(); // Tambahkan ini

  const address = await permit.getAddress(); // Gunakan getAddress()

  console.log(`✅ Contract deployed at: ${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
