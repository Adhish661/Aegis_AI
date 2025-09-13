// import React from "react";

// export default function ActionHistory({ actions }) {
//   if (!actions || actions.length === 0) return <div>No actions yet.</div>;
//   return (
//     <div>
//       {actions.map((a, i) => (
//         <div key={i} style={{ border: "1px solid #eee", padding: 10, marginBottom: 8, borderRadius: 6 }}>
//           <div><strong>Type:</strong> {a.type}</div>
//           {a.by && <div><strong>By:</strong> {a.by}</div>}
//           {a.newSafe && <div><strong>New Safe:</strong> {a.newSafe}</div>}
//           {a.amount && <div><strong>Amount:</strong> {Number(a.amount) / 1e18} ETH</div>}
//           <div style={{ fontSize: 12, color: "#666" }}>{new Date(a.timestamp).toLocaleString()}</div>
//         </div>
//       ))}
//     </div>
//   );
// }
import React from "react";

export default function ActionHistory({ actions }) {
  if (!actions || actions.length === 0) return <div>No actions yet.</div>;

  const getActionType = (a) => {
  if (a.type) return a.type;
  if (a.newSafe) return "Safe Created/Updated";
  if (a.amount && a.from && a.to) return "Funds Transferred";
  if (a.event === "Frozen") return "Freezing";
  if (a.event === "Unfrozen") return "Unfreezing";
  if (a.event === "KeyRotated") return "KeyRotating";
  return "Unknown Action";
};


  return (
    <div>
      {actions.map((a, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #eee",
            padding: 10,
            marginBottom: 8,
            borderRadius: 6,
            background: a.flagged ? "#fff4f4" : "#fff",
          }}
        >
          <div><strong>Type:</strong> {getActionType(a)}</div>
          {a.by && <div><strong>By:</strong> {a.by}</div>}
          {a.newSafe && <div><strong>New Safe:</strong> {a.newSafe}</div>}
          {a.amount && <div><strong>Amount:</strong> {Number(a.amount) / 1e18} ETH</div>}
          <div style={{ fontSize: 12, color: "#666" }}>{new Date(a.timestamp).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
