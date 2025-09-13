require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Load environment variables
const PORT = process.env.PORT || 4000;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const VAULT_ADDRESS = process.env.VAULT_ADDRESS;

// Load ABI (after compiling with Hardhat, it’s in artifacts)
const vaultArtifact = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../artifacts/contracts/Vault.sol/Vault.json"),
    "utf8"
  )
);

// Connect provider + signer
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const vault = new ethers.Contract(VAULT_ADDRESS, vaultArtifact.abi, wallet);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  let txCount = 0;
  const interval = setInterval(async () => {
    txCount++;
    const tx = {
      id: txCount,
      from: "0x" + Math.random().toString(16).substring(2, 42),
      to: "0x" + Math.random().toString(16).substring(2, 42),
      amount: Math.floor(Math.random() * 100),
      status: "ok",
    };

    // Random suspicious
    if (txCount % 4 === 0) {
      tx.status = "suspicious";

      // Emit action for suspicious ones
      io.emit("event", {
        txId: tx.id,
        action: "freeze",
        note: "Suspicious activity detected",
        timestamp: new Date().toISOString(),
      });
      // Example: after rotating the key
        const newOwner = "0xNewOwnerAddress";
        io.emit("action", {
        event: "KeyRotated",
        by: "0xOldOwnerAddress",
        newSafe: newOwner,
        timestamp: new Date().toISOString(),
      });

      // Example: if your contract had a freeze function
      // await vault.freeze();
    }

    // IMPORTANT: match frontend listener key ("tx")
    io.emit("tx", tx);
  }, 3000);

  socket.on("start", () => {
    console.log("Client requested start of tx stream");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
