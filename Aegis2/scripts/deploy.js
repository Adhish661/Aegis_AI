const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  const Vault = await hre.ethers.getContractFactory("Vault");
  const vault = await Vault.deploy(deployer.address);

  // 👇 wait for deployment (v6 way)
  await vault.waitForDeployment();

  console.log("Vault deployed to:", await vault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
