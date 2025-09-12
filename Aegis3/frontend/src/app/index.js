import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const register = async () => {
    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });
    const data = await res.json();
    setAddress(data.address);
  };

  return (
    <div>
      <h1>Create BitVault</h1>
      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={register}>Register</button>
      {address && <p>Your Vault Address: {address}</p>}
    </div>
  );
}
