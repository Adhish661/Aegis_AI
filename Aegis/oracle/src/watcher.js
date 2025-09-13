import { ethers } from "ethers";
import fs from "fs";
import { encryptPrivateKey, saveEncryptedKey } from "./keyManager.js";
import logger from "./logger.js";
import dotenv from 'dotenv';
dotenv.config({ path: './env.local' });

const AEGIS_ABI = JSON.parse(
  fs.readFileSync(new URL("./aegisAbi.json", import.meta.url), "utf-8")
);
const rpcUrl = process.env.RPC_URL;
const oraclePriv = process.env.ORACLE_PRIVATE_KEY;
const aegisAddress = process.env.AEGIS_ADDRESS;
const masterKey = process.env.MASTER_KEY_HEX;

if (!rpcUrl || !oraclePriv || !aegisAddress || !masterKey) {
  logger.error("Missing required env vars: RPC_URL, ORACLE_PRIVATE_KEY, AEGIS_ADDRESS, MASTER_KEY_HEX");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
let signer = new ethers.Wallet(oraclePriv, provider);
const aegis = new ethers.Contract(aegisAddress, AEGIS_ABI, signer);

const THRESH_ETHER = Number(process.env.LARGE_TRANSFER_THRESHOLD_ETH || "5");
const THRESH_WEI = ethers.parseEther(String(THRESH_ETHER));
const WINDOW_SECONDS = Number(process.env.VELOCITY_WINDOW_SECONDS || "20");
const VELOCITY_TX_COUNT = Number(process.env.VELOCITY_TX_COUNT || "3");

const senderMap = new Map();
const auditLog = [];

function recordAudit(action, details) {
  const rec = { ts: new Date().toISOString(), action, details };
  auditLog.unshift(rec);
  logger.info(action, details);
  if (auditLog.length > 1000) auditLog.pop();
}

async function handleSuspicious(sender, reason, tx) {
  try {
    recordAudit("suspicious_detected", { sender, reason, txHash: tx?.hash || null });
    const freezeTx = await aegis.freezeAddress(sender, reason);
    await freezeTx.wait();
    recordAudit("frozen_onchain", { sender, txHash: freezeTx.hash });
    const newWallet = ethers.Wallet.createRandom();
    const encrypted = encryptPrivateKey(newWallet.privateKey, masterKey);
    saveEncryptedKey(newWallet.address, encrypted, { reason, rotatedBy: signer.address });
    const rotateTx = await aegis.rotateKey(newWallet.address, `Auto-rotate: ${reason}`);
    await rotateTx.wait();
    recordAudit("rotated_onchain", { oldOwner: signer.address, newOwner: newWallet.address, txHash: rotateTx.hash });
    try {
      const fundTx = await signer.sendTransaction({
        to: newWallet.address,
        value: ethers.parseEther("0.05")
      });
      await fundTx.wait();
      recordAudit("funded_new_owner", { newOwner: newWallet.address, txHash: fundTx.hash });
    } catch (e) {
      logger.warn("Failed to fund new owner (skip in production)", e.message);
    }
    signer = new ethers.Wallet(newWallet.privateKey, provider);
    aegis.connect(signer);
    recordAudit("switched_local_oracle_signer", { newSigner: signer.address });
  } catch (err) {
    logger.error("Error during handleSuspicious:", err);
    recordAudit("error_handleSuspicious", { error: err.message });
  }
}

export function getAuditLog() {
  return auditLog;
}

export async function startWatcher() {
  logger.info("Starting watcher - listening to pending transactions...");
  provider.on("pending", async (txHash) => {
    try {
      const tx = await provider.getTransaction(txHash);
      if (!tx) return;
      const from = tx.from?.toLowerCase();
      if (!from) return;
      if (tx.value && tx.value > THRESH_WEI) {
        await handleSuspicious(from, `Large transfer ${ethers.formatEther(tx.value)} ETH`, tx);
        return;
      }
      const now = Date.now();
      let arr = senderMap.get(from) || [];
      arr = arr.filter(ts => now - ts <= WINDOW_SECONDS * 1000);
      arr.push(now);
      senderMap.set(from, arr);
      if (arr.length >= VELOCITY_TX_COUNT) {
        await handleSuspicious(from, `High velocity: ${arr.length} txs in ${WINDOW_SECONDS}s`, tx);
        senderMap.set(from, []);
        return;
      }
    } catch (err) {
      logger.warn("Error processing pending tx:", err?.message || err);
    }
  });
  aegis.on("AddressFrozen", (addr, reporter, reason) => {
    recordAudit("event_AddressFrozen", { addr, reporter, reason });
  });
  aegis.on("KeyRotated", (oldKey, newKey, reason) => {
    recordAudit("event_KeyRotated", { oldKey, newKey, reason });
  });
}

