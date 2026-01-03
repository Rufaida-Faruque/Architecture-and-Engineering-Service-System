import { useEffect, useState } from "react";

export default function BidSessionWelcome() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let r = localStorage.getItem("role");

    // normalize roles
    if (r === "cl") r = "client";
    if (r === "sp") r = "sp";
    if (r === "adm") r = "admin";

    setRole(r);
  }, []);

  if (!role) return <h2>Loading bid sessions...</h2>;

  return (
    <div style={{ padding: 30 }}>
      <h1>💰 Bid Sessions</h1>
      <p>Manage and participate in project bidding sessions.</p>

      {/* ---------------- CLIENT ---------------- */}
      {role === "client" && (
        <div style={box}>
          <h3>Client Options</h3>

          <button
            style={btn}
            onClick={() => (window.location.href = "/bidSessions/client")}
          >
            View My Bid Sessions
          </button>

          <button
            style={{ ...btn, marginLeft: 10 }}
            onClick={() => (window.location.href = "/bidSessions/new")}
          >
            Create New Bid Session
          </button>
        </div>
      )}

      {/* ---------------- SERVICE PROVIDER ---------------- */}
      {role === "sp" && (
        <div style={box}>
          <h3>Service Provider Options</h3>

          <button
            style={btn}
            onClick={() => (window.location.href = "/bidSessions/sp")}
          >
            View Open Bid Sessions
          </button>
        </div>
      )}

      {/* ---------------- ADMIN ---------------- */}
      {role === "admin" && (
        <div style={box}>
          <h3>Admin</h3>
          <p>Bid sessions are managed by clients and service providers.</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const box = {
  background: "#f5f5f5",
  padding: 20,
  borderRadius: 8,
  marginTop: 20,
};

const btn = {
  padding: "10px 16px",
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
