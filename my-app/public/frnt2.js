'use client'

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AegisABI from "../AegisABI.json";

export default function Home() {
  const [addr, setAddr] = useState(null);
  const [aegis, setAegis] = useState(null);
  const [frozen, setFrozen] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    async function init() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts && accounts.length > 0) {
          setAddr(accounts[0]);
        }
        const signer = await provider.getSigner();
        const contractAddress = process.env.NEXT_PUBLIC_AEGIS_ADDRESS;
        if (contractAddress) {
          const contract = new ethers.Contract(contractAddress, AegisABI, signer);
          setAegis(contract);
        }
      } catch (error) {
        console.error("Failed to initialize provider/contract:", error);
      }
    }

    init();
  }, []);

  async function checkMyState() {
    if (!aegis || !addr) return;
    try {
      const isFrozen = await aegis.frozen(addr);
      setFrozen(Boolean(isFrozen));
    } catch (error) {
      console.error("Failed to fetch frozen state:", error);
    }
  }

  return (
    <div>
      <h1>Aegis Dashboard</h1>
      <p>Connected: {addr ?? "Not connected"}</p>
      <button onClick={checkMyState}>Check if my account is frozen</button>
      {frozen !== null && <p>Frozen: {String(frozen)}</p>}
    </div>
  );
}        