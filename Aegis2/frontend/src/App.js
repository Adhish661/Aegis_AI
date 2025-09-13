import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import TransactionList from "./components/TransactionList";
import ActionHistory from "./components/ActionHistory";

const socket = io("http://localhost:4000");

function App() {
  const [transactions, setTransactions] = useState([]);
  const [actions, setActions] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    // ✅ match backend emit ("tx")
    socket.on("tx", (tx) => {
      setTransactions((prev) => [tx, ...prev].slice(0, 20));
    });

    socket.on("action", (action) => {
      setActions((prev) => [action, ...prev]);
    });

    return () => {
      socket.off("tx");
      socket.off("action");
    };
  }, []);

  function start() {
    setTransactions([]);
    setActions([]);
    setRunning(true);
    socket.emit("start");
  }

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Vault Monitor — Demo</h1>
      <p>Simulated transactions with suspicious detection. Uses socket.io for live updates.</p>
      <button
        onClick={start}
        disabled={running}
        style={{ padding: "8px 16px", marginBottom: 12 }}
      >
        {running ? "Running..." : "Start Transactions"}
      </button>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h2>Transactions</h2>
          <TransactionList txs={transactions} />
        </div>
        <div style={{ width: 420 }}>
          <h2>Action History</h2>
          <ActionHistory actions={actions} />
        </div>
      </div>
    </div>
  );
}

export default App;
