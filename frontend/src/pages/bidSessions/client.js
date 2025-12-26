// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function ClientBidSessions() {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userId =
//     typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   const role =
//     typeof window !== "undefined" ? localStorage.getItem("role") : null;

//   useEffect(() => {
//     if (!userId || role !== "cl") return;
//     loadSessions();
//   }, [userId, role]);

//   async function loadSessions() {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/bidSessions/client/${userId}`
//       );
//       setSessions(res.data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load bid sessions");
//     }
//     setLoading(false);
//   }

//   if (loading) return <h2>Loading your bid sessions...</h2>;
//   if (role !== "cl") return <h2>Unauthorized — Clients only</h2>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h1>📂 My Bid Sessions</h1>

//       {sessions.length === 0 && (
//         <p>You haven’t created any bid sessions yet.</p>
//       )}

//       {sessions.map((s) => (
//         <div key={s._id} style={card}>
//           <h3>{s.title}</h3>
//           <p>{s.description}</p>

//           <p>
//             <b>Status:</b>{" "}
//             <span style={{ color: s.status === "open" ? "green" : "red" }}>
//               {s.status.toUpperCase()}
//             </span>
//           </p>

//           <p>
//             <b>Bid visibility:</b>{" "}
//             {s.allowBidVisibility ? "Visible to SPs" : "Hidden"}
//           </p>

//           <button
//             style={btn}
//             onClick={() =>
//               (window.location.href = `/bidSessions/${s._id}`)
//             }
//           >
//             Open Session
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ---------- styles ---------- */

// const card = {
//   background: "white",
//   padding: 16,
//   borderRadius: 8,
//   marginBottom: 14,
//   boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
// };

// const btn = {
//   padding: "8px 14px",
//   background: "#0070f3",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
// };













// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/router"; // Import useRouter from Next.js

// export default function ClientBidSessions() {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userId =
//     typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   const role =
//     typeof window !== "undefined" ? localStorage.getItem("role") : null;

//   const router = useRouter(); // Initialize the useRouter hook

//   useEffect(() => {
//     if (!userId || role !== "cl") return;
//     loadSessions();
//   }, [userId, role]);

//   async function loadSessions() {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/bidSessions/client/${userId}`
//       );
//       setSessions(res.data || []);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load bid sessions");
//     }
//     setLoading(false);
//   }

//   if (loading) return <h2>Loading your bid sessions...</h2>;
//   if (role !== "cl") return <h2>Unauthorized — Clients only</h2>;

//   const handleOpenSession = (sessionId) => {
//     router.push(`/bidSessions/${sessionId}`); // Use router.push for dynamic routing
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <h1>📂 My Bid Sessions</h1>

//       {sessions.length === 0 && (
//         <p>You haven’t created any bid sessions yet.</p>
//       )}

//       {sessions.map((s) => (
//         <div key={s._id} style={card}>
//           <h3>{s.title}</h3>
//           <p>{s.description}</p>

//           <p>
//             <b>Status:</b>{" "}
//             <span style={{ color: s.status === "open" ? "green" : "red" }}>
//               {s.status.toUpperCase()}
//             </span>
//           </p>

//           <p>
//             <b>Bid visibility:</b>{" "}
//             {s.allowBidVisibility ? "Visible to SPs" : "Hidden"}
//           </p>

//           <button
//             style={btn}
//             onClick={() => handleOpenSession(s._id)} // Call handleOpenSession on click
//           >
//             Open Session
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ---------- styles ---------- */

// const card = {
//   background: "white",
//   padding: 16,
//   borderRadius: 8,
//   marginBottom: 14,
//   boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
// };

// const btn = {
//   padding: "8px 14px",
//   background: "#0070f3",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
// };











// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/router";

// export default function ClientBidSessions() {
//   const router = useRouter();

//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     // Fetch all the sessions created by the client
//     async function fetchSessions() {
//       try {
//         const userId = localStorage.getItem("userId");
//         const res = await axios.get(`http://localhost:5000/api/bidSessions/client/${userId}`);
//         setSessions(res.data);
//       } catch (err) {
//         setError("Failed to load sessions");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSessions();
//   }, []);

//   if (loading) return <h2>Loading your sessions...</h2>;
//   if (error) return <h2>{error}</h2>;

//   return (
//     <div>
//       <h1>Your Created Bid Sessions</h1>
//       {sessions.length === 0 ? (
//         <p>You haven't created any bid sessions yet.</p>
//       ) : (
//         <ul>
//           {sessions.map((session) => (
//             <li key={session._id}>
//               <h3>{session.title}</h3>
//               <p>{session.description}</p>
//               <p>Status: {session.status}</p>
//               <button onClick={() => router.push(`/clientEdit/${session._id}`)}>
//                 View/Edit Session
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }










import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ClientBidSessions() {
  const router = useRouter();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all the sessions created by the client
    async function fetchSessions() {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`http://localhost:5000/api/bidSessions/client/${userId}`);
        setSessions(res.data);
      } catch (err) {
        setError("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  if (loading) return <h2>Loading your sessions...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h1>Your Created Bid Sessions</h1>
      {sessions.length === 0 ? (
        <p>You haven't created any bid sessions yet.</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session._id}>
              <h3>{session.title}</h3>
              <p>{session.description}</p>
              <p>Status: {session.status}</p>
              <button onClick={() => router.push(`/bidSessions/clientEdit/${session._id}`)}>
                View/Edit Session
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
