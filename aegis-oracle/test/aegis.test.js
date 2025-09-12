import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

async function waitForDeployment(c) {
  if (typeof c.waitForDeployment === "function") {
    await c.waitForDeployment();
  } else if (typeof c.deployed === "function") {
    await c.deployed();
  }
}

describe("Aegis (core flows)", function () {
  it("mint, transfer, freeze, and rotateKey", async function () {
    const [owner, alice, bob, guardian] = await ethers.getSigners();

    // Deploy Aegis
    const AegisFactory = await ethers.getContractFactory("Aegis");
    const aegis = await AegisFactory.connect(owner).deploy();
    await waitForDeployment(aegis);

    // owner sets a guardian
    await aegis.connect(owner).setGuardian(await guardian.getAddress(), true);

    // mint to alice
    await aegis.connect(owner).mint(await alice.getAddress(), 100);
    expect((await aegis.balance(await alice.getAddress())).toString()).to.equal("100");

    // transfer from alice -> bob
    await aegis.connect(alice).transfer(await bob.getAddress(), 10);
    expect((await aegis.balance(await bob.getAddress())).toString()).to.equal("10");

    // guardian freezes alice
    await aegis.connect(guardian).freezeAddress(await alice.getAddress(), "suspected compromise");
    await expect(aegis.connect(alice).transfer(await bob.getAddress(), 1)).to.be.revertedWith("Sender is frozen");

    // rotate owner to a new wallet address
    const newOwner = ethers.Wallet.createRandom().address;
    await aegis.connect(owner).rotateKey(newOwner, "test rotate");
    expect(await aegis.owner()).to.equal(newOwner);
  });
});
