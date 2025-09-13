import fs from "fs";
import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("Deploying contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Deploy Aegis contract
  const Aegis = await ethers.getContractFactory("Aegis", deployer);
  const aegis = await Aegis.deploy();
  await aegis.waitForDeployment();

  const aegisAddress = await aegis.getAddress();
  console.log("✅ Aegis deployed to:", aegisAddress);

  // Deploy SmartWallet contract with deployer as owner
  const SmartWallet = await ethers.getContractFactory("SmartWallet", deployer);
  const smartWallet = await SmartWallet.deploy(deployer.address);
  await smartWallet.waitForDeployment();

  const smartWalletAddress = await smartWallet.getAddress();
  console.log("✅ SmartWallet deployed to:", smartWalletAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Aegis Contract:", aegisAddress);
  console.log("SmartWallet Contract:", smartWalletAddress);
  console.log("Deployer:", deployer.address);

  // Save deployment info
  const deploymentInfo = {
    aegisAddress,
    smartWalletAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    network: "localhost"
  };

  fs.writeFileSync("./deployment.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to deployment.json");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});


// const { ethers } = require("hardhat");
// import fs from "fs";

// async function main() {
//   console.log("Deploying contracts...");

//   // Deploy Aegis contract
//   const Aegis = await ethers.getContractFactory("Aegis");
//   const aegis = await Aegis.deploy();
//   await aegis.waitForDeployment();

//   const aegisAddress = await aegis.getAddress();
//   console.log("Aegis deployed to:", aegisAddress);

//   // Deploy SmartWallet contract
//   const SmartWallet = await ethers.getContractFactory("SmartWallet");
//   const smartWallet = await SmartWallet.deploy(await aegis.signer.getAddress());
//   await smartWallet.waitForDeployment();

//   const smartWalletAddress = await smartWallet.getAddress();
//   console.log("SmartWallet deployed to:", smartWalletAddress);

//   console.log("\n=== Deployment Summary ===");
//   console.log("Aegis Contract:", aegisAddress);
//   console.log("SmartWallet Contract:", smartWalletAddress);
//   console.log("Deployer:", await aegis.signer.getAddress());

//   // Save deployment info
//   const deploymentInfo = {
//     aegisAddress,
//     smartWalletAddress,
//     deployer: await aegis.signer.getAddress(),
//     timestamp: new Date().toISOString(),
//     network: "localhost"
//   };

//   fs.writeFileSync('./deployment.json', JSON.stringify(deploymentInfo, null, 2));
//   console.log("\nDeployment info saved to deployment.json");
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

