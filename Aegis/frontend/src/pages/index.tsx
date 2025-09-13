import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const AEGIS_ADDRESS = process.env.NEXT_PUBLIC_AEGIS_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const ORACLE_API_URL = process.env.NEXT_PUBLIC_ORACLE_URL || 'http://localhost:3001';

interface AuditEntry {
  ts: string;
  action: string;
  details?: any;
}

// Simplified Aegis contract ABI
const AEGIS_ABI = [
  "function balance(address) view returns (uint256)",
  "function transfer(address to, uint256 amount)",
  "function mint(address to, uint256 amount)",
  "function frozen(address) view returns (bool)",
  "function flagged(address) view returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const Home: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [isConnected, setIsConnected] = useState(false);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuditLog();
    const interval = setInterval(fetchAuditLog, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuditLog = async () => {
    try {
      if (!ORACLE_API_URL) throw new Error('Oracle API URL is not defined');
      const response = await axios.get(`${ORACLE_API_URL}/audit`);
      setAuditLog(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch audit log:', error.message || error);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        setAccount(accounts[0]);
        setIsConnected(true);

        const contract = new ethers.Contract(AEGIS_ADDRESS, AEGIS_ABI, signer);
        const userBalance = await contract.balance(accounts[0]);
        setBalance(ethers.formatEther(userBalance));
      } catch (error: any) {
        console.error('Failed to connect wallet:', error.message || error);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  };

  const handleTransfer = async () => {
    if (!isConnected || !transferTo || !transferAmount) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AEGIS_ADDRESS, AEGIS_ABI, signer);

      const tx = await contract.transfer(transferTo, ethers.parseEther(transferAmount));
      await tx.wait();

      const userBalance = await contract.balance(account);
      setBalance(ethers.formatEther(userBalance));

      setTransferTo('');
      setTransferAmount('');
      alert('Transfer successful!');
    } catch (error: any) {
      alert(`Transfer failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const mintTokens = async () => {
    if (!isConnected) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(AEGIS_ADDRESS, AEGIS_ABI, signer);

      const tx = await contract.mint(account, ethers.parseEther('100'));
      await tx.wait();

      const userBalance = await contract.balance(account);
      setBalance(ethers.formatEther(userBalance));

      alert('Minted 100 tokens!');
    } catch (error: any) {
      alert(`Mint failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Aegis Security Oracle Dashboard</h1>

      {!isConnected ? (
        <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p><strong>Connected:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance} AEG</p>

          <div style={{ margin: '20px 0' }}>
            <h3>Transfer Tokens</h3>
            <input
              type="text"
              placeholder="Recipient address"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              style={{ margin: '5px', padding: '8px' }}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              style={{ margin: '5px', padding: '8px' }}
            />
            <button onClick={handleTransfer} disabled={loading} style={{ padding: '8px 16px' }}>
              {loading ? 'Processing...' : 'Transfer'}
            </button>
          </div>

          <div style={{ margin: '20px 0' }}>
            <button onClick={mintTokens} disabled={loading} style={{ padding: '8px 16px' }}>
              {loading ? 'Processing...' : 'Mint 100 Tokens'}
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h3>Security Audit Log</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
          {auditLog.length === 0 ? (
            <p>No audit log entries found.</p>
          ) : (
            auditLog.map((entry, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '8px', backgroundColor: '#f5f5f5' }}>
                <strong>{entry.ts}</strong> - {entry.action}
                {entry.details && (
                  <pre style={{ margin: '5px 0', fontSize: '12px' }}>
                    {JSON.stringify(entry.details, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
