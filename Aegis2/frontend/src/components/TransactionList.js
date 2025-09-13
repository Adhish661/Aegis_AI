// import React from "react";

// export default function TransactionList({ txs }) {
//   if (!txs || txs.length === 0) return <div>No transactions yet.</div>;

//   const getStatus = (tx) => {
//     if (tx.flagged && tx.flagReason) return `Flagged: ${tx.flagReason}`;
//     if (tx.flagged) return "Flagged suspicious";
//     return "Normal";
//   };

//   return (
//     <div>
//       {txs.map(tx => (
//         <div
//           key={tx.id}
//           style={{
//             border: "1px solid #ddd",
//             padding: 10,
//             marginBottom: 8,
//             borderRadius: 6,
//             background: tx.flagged ? "#fff4f4" : "#fff",
//           }}
//         >
//           <div><strong>TX ID:</strong> {tx.id}</div>
//           <div><strong>From:</strong> {tx.from}</div>
//           <div><strong>To:</strong> {tx.to}</div>
//           <div><strong>Amount:</strong> {Number(tx.amount) / 1e18} ETH</div>
//           <div style={{ color: tx.flagged ? "red" : "green" }}>{getStatus(tx)}</div>
//         </div>
//       ))}
//     </div>
//   );
// }
import React from "react";

export default function TransactionList({ txs }) {
  if (!txs || txs.length === 0) return <div>No transactions yet.</div>;

  const getStatusDisplay = (tx) => {
    switch (tx.status) {
      case "suspicious":
        return { text: "Suspicious", color: "red", bg: "#fff4f4" };
      case "blocked":
        return { text: "Blocked", color: "orange", bg: "#fff7e6" };
      default:
        return { text: "Normal", color: "green", bg: "#f0fff0" };
    }
  };

  return (
    <div>
      {txs.map((tx) => {
        const { text, color, bg } = getStatusDisplay(tx);
        return (
          <div
            key={tx.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 8,
              borderRadius: 6,
              background: bg,
            }}
          >
            <div>
              <div><strong>TX ID:</strong> {tx.id}</div>
              <div><strong>From:</strong> {tx.from}</div>
              <div><strong>To:</strong> {tx.to}</div>
              <div><strong>Amount:</strong> {Number(tx.amount) / 1e18} ETH</div>
              <div style={{ color }}>{text}</div>
            </div>

            {/* Show smart contract used if transaction is suspicious/blocked */}
            {(tx.status === "suspicious" || tx.status === "blocked") && tx.contractName && (
              <div style={{ alignSelf: "center", fontWeight: "bold", color: "red" }}>
                {tx.contractName}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
