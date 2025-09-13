require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { ethers } = require('ethers');
const VaultAbi = [
  // ABI minimal pieces we need: freeze, withdraw, deposit, recordTx, frozen getter
  "function freeze() external",
  "function unfreeze() external",
  "function withdraw(address payable to, uint256 amount) external",
  "function recordTx(bytes32 txId, address from, address to, uint256 amount, bool flagged) external",
  "function frozen() view returns (bool)",
  "receive() external payable",
  "event Deposited(address indexed from, uint256 amount, uint256 balance)",
  "event Withdrawn(address indexed to, uint256 amount)",
  "event Frozen(address indexed by, uint256 timestamp)",
  "event TxRecorded(bytes32 txId, address from, address to, uint256 amount, bool flagged)"
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const RPC = process.env.RPC_URL || "http://127.0.0.1:8545";
const provider = new ethers.providers.JsonRpcProvider(RPC);
const adminPrivateKey = process.env.PRIVATE_KEY;
const adminWallet = new ethers.Wallet(adminPrivateKey, provider);

let vaultAddress = process.env.VAULT_ADDRESS || null;
let vaultContract;

async function deployVaultIfNeeded() {
  if (vaultAddress) {
    vaultContract = new ethers.Contract(vaultAddress, VaultAbi, adminWallet);
    return;
  }
  // Minimal deployment using ethers ContractFactory (requires compiled bytecode)
  // For simplicity in this snippet, assume you deployed separately and set VAULT_ADDRESS.
  throw new Error("Please deploy Vault.sol and set VAULT_ADDRESS in .env");
}

// Mock/simulate AI suspiciousness check.
// Replace this with real AI API call (OpenAI, custom model, etc.)
function isSuspicious(tx) {
  // heuristic: amount > threshold OR 15% random chance
  const threshold = ethers.utils.parseEther("1.0"); // 1 ETH
  if (ethers.BigNumber.from(tx.amount).gte(threshold)) return true;
  if (Math.random() < 0.15) return true;
  return false;
}

// Mock create Gnosis Safe and return a new address.
// Real integration: use @gnosis.pm/safe-core-sdk and create via backend with a signer.
async function createGnosisSafeMock() {
  // Just create a new random address for demo
  const randomWallet = ethers.Wallet.createRandom();
  return randomWallet.address;
}

io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("start", async () => {
    console.log("start requested");
    // Simulate 10 transactions, one every 1s
    for (let i = 1; i <= 10; i++) {
      const tx = {
        id: ethers.utils.hexlify(ethers.utils.randomBytes(8)),
        from: ethers.Wallet.createRandom().address,
        to: vaultAddress || adminWallet.address,
        amount: ethers.utils.parseEther((Math.random() * 2).toFixed(3)).toString(), // 0-2 ETH
        timestamp: Date.now(),
      };

      // Check suspiciousness
      const flagged = isSuspicious(tx);

      // Record on-chain optionally (we show but commented to avoid gas in dev)
      try {
        // await vaultContract.recordTx(tx.id, tx.from, tx.to, tx.amount, flagged);
      } catch (err) {
        console.warn("recordTx failed (skip in dev):", err.message);
      }

      io.emit("tx", { ...tx, flagged });

      if (flagged) {
        // Take actions:
        // 1) Freeze the vault (on-chain)
        try {
          // await vaultContract.freeze();
          io.emit("action", { type: "freeze", by: adminWallet.address, txId: tx.id, timestamp: Date.now() });
        } catch (err) {
          console.warn("freeze failed (skip in dev):", err.message);
          io.emit("action", { type: "freeze_failed", err: err.message, txId: tx.id, timestamp: Date.now() });
        }

        // 2) Create new Gnosis Safe (mock) and transfer funds to it
        const newSafe = await createGnosisSafeMock();
        try {
          // withdraw all funds to newSafe; for demo just emit action
          // const balance = await provider.getBalance(vaultContract.address);
          // await vaultContract.withdraw(newSafe, balance);
          io.emit("action", { type: "transfer_to_new_vault", fromVault: vaultAddress || adminWallet.address, newSafe, amount: tx.amount, txId: tx.id, timestamp: Date.now() });
        } catch (err) {
          console.warn("transfer failed (skip in dev):", err.message);
          io.emit("action", { type: "transfer_failed", err: err.message, txId: tx.id, timestamp: Date.now() });
        }
      }

      // small delay
      await new Promise(r => setTimeout(r, 800));
    }
    io.emit("done");
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  console.log("backend listening on", PORT);
  try {
    await deployVaultIfNeeded();
  } catch (err) {
    console.warn("vault hook:", err.message);
  }
});
