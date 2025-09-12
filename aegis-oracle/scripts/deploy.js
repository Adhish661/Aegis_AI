const fs = require("fs");
const hre = require("hardhat");

async function waitForDeployment(c) {
  if (typeof c.waitForDeployment === "function") {
    await c.waitForDeployment();
  } else if (typeof c.deployed === "function") {
    await c.deployed();
  } else {
    // fallback: small delay (shouldn't be needed)
    await new Promise((r) => setTimeout(r, 1000));
  }
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log("Deploying with:", deployerAddress);

  // Aegis
  const AegisFactory = await hre.ethers.getContractFactory("Aegis");
  const aegis = await AegisFactory.connect(deployer).deploy();
  await waitForDeployment(aegis);
  console.log("Aegis deployed to:", aegis.target ?? aegis.address ?? aegis.address);

  // SmartWallet (example owned by deployer)
  const WalletFactory = await hre.ethers.getContractFactory("SmartWallet");
  const wallet = await WalletFactory.connect(deployer).deploy(deployerAddress);
  await waitForDeployment(wallet);
  console.log("SmartWallet deployed to:", wallet.target ?? wallet.address ?? wallet.address);

  // Write addresses to a file so frontend/oracle teams can pick them up
  const out = `AEGIS_ADDRESS=${(aegis.target ?? aegis.address ?? aegis.address)}\nSMARTWALLET_ADDRESS=${(wallet.target ?? wallet.address ?? wallet.address)}\n`;
  fs.writeFileSync(".env.local", out);
  console.log("Wrote .env.local with addresses");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
