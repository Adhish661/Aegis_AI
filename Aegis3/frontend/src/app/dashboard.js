import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("alert", (data) => {
      setAlerts((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>BitVault Dashboard</h1>
      <ul>
        {alerts.map((alert, index) => (
          <li key={index} style={{ color: alert.type === "warning" ? "red" : "green" }}>
            {alert.message} {alert.newKey ? `(New Key: ${alert.newKey})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
