// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminDashboard() {
//   const [pendingRepos, setPendingRepos] = useState([]);
//   const [verifications, setVerifications] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
//   const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   useEffect(() => {
//     if (!userId || role !== "adm") return;
//     load();
//     // eslint-disable-next-line
//   }, [userId, role]);

//   async function load() {
//     setLoading(true);
//     try {
//       // repositories needing approval (not locked)
//       let repos = [];
//       try {
//         const res = await axios.get("http://localhost:5000/api/repositories");
//         const arr = res.data.repos || res.data || [];
//         repos = arr.filter(r => !r.is_locked);
//       } catch (e) {
//         repos = [];
//       }
//       setPendingRepos(repos);

//       // verification requests (assuming endpoint /api/admin/verification)
//       try {
//         const v = await axios.get("http://localhost:5000/api/admin/verification");
//         setVerifications(v.data || []);
//       } catch (e) {
//         setVerifications([]);
//       }

//       // reports (assuming endpoint /api/admin/reports)
//       try {
//         const rep = await axios.get("http://localhost:5000/api/admin/reports");
//         setReports(rep.data || []);
//       } catch (e) {
//         setReports([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) return <h2>Loading admin dashboard...</h2>;
//   if (role !== "adm") return <h2>Unauthorized — Admin only</h2>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h1>Admin dashboard</h1>

//       <section style={section}>
//         <h2>⏳ Repositories awaiting approval</h2>
//         {pendingRepos.length === 0 && <p>No repositories pending approval.</p>}
//         {pendingRepos.map(r => (
//           <div key={r._id} style={card}>
//             <h3>{r.title}</h3>
//             <p>{r.description}</p>
//             <p><b>Created by:</b> {r.createdBy?.email || "—"}</p>

//             <div style={{ marginTop: 8 }}>
//               <button style={btn} onClick={() => window.location.href = `/repositories/${r._id}`}>Open</button>
//               <button style={{ ...btn, marginLeft: 8 }} onClick={async () => {
//                 try {
//                   await axios.patch(`http://localhost:5000/api/repositories/${r._id}/lock`, { adminId: userId });
//                   // refresh
//                   const idx = pendingRepos.findIndex(x => x._id === r._id);
//                   const copy = [...pendingRepos]; copy.splice(idx,1);
//                   setPendingRepos(copy);
//                 } catch (e) {
//                   alert("Failed to lock repo");
//                 }
//               }}>Approve & Lock</button>
//             </div>
//           </div>
//         ))}
//       </section>

//       <section style={section}>
//         <h2>🔎 Verification requests</h2>
//         {verifications.length === 0 && <p>No pending verifications.</p>}
//         {verifications.map(v => (
//           <div key={v._id} style={card}>
//             <p><b>User:</b> {v.userEmail || v.user || "—"}</p>
//             <p><b>Submitted:</b> {v.createdAt ? new Date(v.createdAt).toLocaleString() : "—"}</p>
//             <div>
//               <button style={btn} onClick={() => window.location.href = `/admin/verification/${v._id}`}>Review</button>
//             </div>
//           </div>
//         ))}
//       </section>

//       <section style={section}>
//         <h2>🚩 Reports</h2>
//         {reports.length === 0 && <p>No reports.</p>}
//         {reports.map(rp => (
//           <div key={rp._id} style={card}>
//             <p><b>Type:</b> {rp.type || "report"}</p>
//             <p><b>About:</b> {rp.target || "—"}</p>
//             <div>
//               <button style={btn} onClick={() => window.location.href = `/admin/reports/${rp._id}`}>Review</button>
//             </div>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }

// /* styles */
// const section = { background: "#fafafa", padding: 18, borderRadius: 8, marginTop: 20 };
// const card = { background: "white", padding: 12, borderRadius: 8, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
// const btn = { padding: "8px 12px", background: "#0070f3", color: "white", border: "none", borderRadius: 6, cursor: "pointer" };












// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminDashboard() {
//   const [pendingRepos, setPendingRepos] = useState([]);
//   const [verifications, setVerifications] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const role =
//     typeof window !== "undefined" ? localStorage.getItem("role") : null;
//   const userId =
//     typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   useEffect(() => {
//     if (!userId || role !== "adm") return;
//     loadDashboard();
//   }, [userId, role]);

//   async function loadDashboard() {
//     setLoading(true);

//     try {
//       /* --------------------------------------- */
//       /*            LOAD REPOSITORIES            */
//       /* --------------------------------------- */
//       let reposArr = [];
//       try {
//         const res = await axios.get("http://localhost:5000/api/repositories");
//         const arr = res.data.repos || res.data || [];

//         // ONLY repos waiting for approval
//         reposArr = arr.filter(
//           (r) => r.requested === true && r.is_locked === false
//         );
//       } catch {
//         reposArr = [];
//       }
//       setPendingRepos(reposArr);

//       /* --------------------------------------- */
//       /*          LOAD VERIFICATION REQUESTS     */
//       /* --------------------------------------- */
//       try {
//         const v = await axios.get("http://localhost:5000/api/admin/verification");
//         setVerifications(v.data || []);
//       } catch {
//         setVerifications([]);
//       }

//       /* --------------------------------------- */
//       /*                 LOAD REPORTS            */
//       /* --------------------------------------- */
//       try {
//         const rep = await axios.get("http://localhost:5000/api/admin/reports");
//         setReports(rep.data || []);
//       } catch {
//         setReports([]);
//       }

//     } finally {
//       setLoading(false);
//     }
//   }

//   /* --------------------------------------- */
//   /*      APPROVE (LOCK) A REPOSITORY        */
//   /* --------------------------------------- */
//   async function approveRepo(repoId) {
//     try {
//       await axios.patch(
//         `http://localhost:5000/api/repositories/${repoId}/lock`,
//         { adminId: userId }
//       );

//       alert("Repository approved & locked.");
//       setPendingRepos((prev) => prev.filter((r) => r._id !== repoId));
//     } catch (e) {
//       alert("Failed to approve repository.");
//     }
//   }

//   if (loading) return <h2>Loading admin dashboard...</h2>;
//   if (role !== "adm") return <h2>Unauthorized — Admin only</h2>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h1>Admin Dashboard</h1>

//       {/* ----------------------------------------- */}
//       {/*           PENDING REPOSITORIES            */}
//       {/* ----------------------------------------- */}
//       <section style={section}>
//         <h2>⏳ Repositories Awaiting Approval</h2>

//         {pendingRepos.length === 0 && <p>No repositories pending approval.</p>}

//         {pendingRepos.map((r) => (
//           <div key={r._id} style={card}>
//             <h3>{r.title}</h3>
//             <p>{r.description}</p>
//             <p>
//               <b>Created by:</b> {r.createdBy?.email || "Unknown"}
//             </p>

//             <div style={{ marginTop: 8 }}>
//               <button
//                 style={btn}
//                 onClick={() =>
//                   (window.location.href = `/repositories/${r._id}`)
//                 }
//               >
//                 Open
//               </button>

//               <button
//                 style={{ ...btn, background: "green", marginLeft: 8 }}
//                 onClick={() => approveRepo(r._id)}
//               >
//                 Approve & Lock
//               </button>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* ----------------------------------------- */}
//       {/*          VERIFICATION REQUESTS           */}
//       {/* ----------------------------------------- */}
//       <section style={section}>
//         <h2>🔎 Verification Requests</h2>

//         {verifications.length === 0 && <p>No pending verifications.</p>}

//         {verifications.map((v) => (
//           <div key={v._id} style={card}>
//             <p>
//               <b>User:</b> {v.userEmail || v.user || "Unknown"}
//             </p>
//             <p>
//               <b>Submitted:</b>{" "}
//               {v.createdAt ? new Date(v.createdAt).toLocaleString() : "—"}
//             </p>

//             <button
//               style={btn}
//               onClick={() =>
//                 (window.location.href = `/admin/verification/${v._id}`)
//               }
//             >
//               Review
//             </button>
//           </div>
//         ))}
//       </section>

//       {/* ----------------------------------------- */}
//       {/*                 REPORTS                   */}
//       {/* ----------------------------------------- */}
//       <section style={section}>
//         <h2>🚩 Reports</h2>

//         {reports.length === 0 && <p>No reports.</p>}

//         {reports.map((rp) => (
//           <div key={rp._id} style={card}>
//             <p>
//               <b>Type:</b> {rp.type || "Report"}
//             </p>
//             <p>
//               <b>About:</b> {rp.target || "Unknown"}
//             </p>

//             <button
//               style={btn}
//               onClick={() =>
//                 (window.location.href = `/admin/reports/${rp._id}`)
//               }
//             >
//               Review
//             </button>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }


// <button
//   onClick={() => (window.location.href = "/api/google/auth")}
//   style={btn}
// >
//   Connect Google Calendar
// </button>

// /* ---------- STYLES ---------- */
// const section = {
//   background: "#fafafa",
//   padding: 18,
//   borderRadius: 8,
//   marginTop: 20,
// };

// const card = {
//   background: "white",
//   padding: 12,
//   borderRadius: 8,
//   marginBottom: 12,
//   boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
// };

// const btn = {
//   padding: "8px 12px",
//   background: "#0070f3",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
// };
















// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminDashboard() {
//   const [reposPending, setReposPending] = useState([]);
//   const [reposLocked, setReposLocked] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userId =
//     typeof window !== "undefined" ? localStorage.getItem("userId") : null;
//   const role =
//     typeof window !== "undefined" ? localStorage.getItem("role") : null;

//   useEffect(() => {
//     if (role !== "adm") return;
//     loadRepos();
//   }, [role]);

//   async function loadRepos() {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/repositories");
//       const allRepos = res.data.repos || [];

//       // Waiting for admin approval (requested)
//       const pending = allRepos.filter((r) => r.requested === true && !r.is_locked);

//       // Already approved/locked projects
//       const locked = allRepos.filter((r) => r.is_locked === true);

//       setReposPending(pending);
//       setReposLocked(locked);
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   }

//   async function approveRepo(id) {
//     if (!confirm("Approve and LOCK this project?")) return;
//     try {
//       await axios.patch(`http://localhost:5000/api/repositories/${id}/lock`, {
//         adminId: userId,
//       });
//       alert("Repository approved and locked.");
//       loadRepos();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error approving");
//     }
//   }

//   // if (role !== "adm") return <h2>Unauthorized — Admin only</h2>;
//   // if (loading) return <h2>Loading admin dashboard...</h2>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h1>Admin Dashboard</h1>

//       {/* ======================= PENDING APPROVAL ======================= */}
//       <section style={section}>
//         <h2>⏳ Pending Approval</h2>

//         {reposPending.length === 0 && (
//           <p>No repositories are waiting for approval.</p>
//         )}

//         {reposPending.map((repo) => (
//           <div key={repo._id} style={card}>
//             <h3>{repo.title}</h3>
//             <p>{repo.description}</p>

//             <p>
//               <b>Created by:</b> {repo.createdBy?.email}
//             </p>

//             <button
//               style={btnApprove}
//               onClick={() => approveRepo(repo._id)}
//             >
//               Approve & Lock
//             </button>

//             <button
//               style={btn}
//               onClick={() => (window.location.href = `/repositories/${repo._id}`)}
//             >
//               View Repository
//             </button>
//           </div>
//         ))}
//       </section>

//       {/* ======================= LOCKED PROJECTS ======================= */}
//       <section style={section}>
//         <h2>🔒 Approved (Locked) Repositories</h2>

//         {reposLocked.length === 0 && (
//           <p>No locked repositories yet.</p>
//         )}

//         {reposLocked.map((repo) => (
//           <div key={repo._id} style={card}>
//             <h3>{repo.title}</h3>
//             <p>{repo.description}</p>

//             <p>
//               <b>Created by:</b> {repo.createdBy?.email}
//             </p>

//             <button
//               style={btn}
//               onClick={() => (window.location.href = `/repositories/${repo._id}`)}
//             >
//               View Repository
//             </button>
//           </div>
//         ))}
//       </section>
//     </div>
//   );
// }

// /* ---------- STYLES ---------- */
// const section = {
//   background: "#fafafa",
//   padding: 18,
//   borderRadius: 8,
//   marginTop: 20,
// };

// const card = {
//   background: "white",
//   padding: 12,
//   borderRadius: 8,
//   marginBottom: 12,
//   boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
// };

// const btn = {
//   padding: "8px 12px",
//   background: "#0070f3",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
//   marginRight: 10,
// };

// const btnApprove = {
//   padding: "8px 12px",
//   background: "green",
//   color: "white",
//   border: "none",
//   borderRadius: 6,
//   cursor: "pointer",
//   marginRight: 10,
// };

















// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminDashboard() {
//   const [reposPending, setReposPending] = useState([]);
//   const [reposLocked, setReposLocked] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [authChecked, setAuthChecked] = useState(false);
//   const [role, setRole] = useState(null);
//   const [userId, setUserId] = useState(null);

//   // 1) Read localStorage on client only
//   useEffect(() => {
//     setUserId(localStorage.getItem("userId"));
//     setRole(localStorage.getItem("role"));
//     setAuthChecked(true);
//   }, []);

//   // 2) After auth is known, load repos if admin
//   useEffect(() => {
//     if (!authChecked) return;
//     if (role !== "adm") {
//       setLoading(false);
//       return;
//     }
//     loadRepos();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authChecked, role]);

//   async function loadRepos() {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/repositories");
//       const allRepos = res.data.repos || [];

//       setReposPending(allRepos.filter((r) => r.requested === true && !r.is_locked));
//       setReposLocked(allRepos.filter((r) => r.is_locked === true));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function approveRepo(id) {
//     if (!confirm("Approve and LOCK this project?")) return;
//     try {
//       await axios.patch(`http://localhost:5000/api/repositories/${id}/lock`, { adminId: userId });
//       alert("Repository approved and locked.");
//       loadRepos();
//     } catch (err) {
//       alert(err.response?.data?.message || "Error approving");
//     }
//   }

//   // ✅ stable first render (prevents hydration mismatch)
//   if (!authChecked) return <h2>Loading admin dashboard...</h2>;
//   if (role !== "adm") return <h2>Unauthorized — Admin only</h2>;
//   if (loading) return <h2>Loading admin dashboard...</h2>;

//   return (
//     <div style={{ padding: 24 }}>
//       <h1>Admin Dashboard</h1>
//       {/* keep your Pending + Locked sections exactly as you have them */}
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [reposPending, setReposPending] = useState([]);
  const [reposLocked, setReposLocked] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    if (!userId || role !== "adm") return;
    loadReposAndRequests();
    // eslint-disable-next-line
  }, [userId, role]);

  async function loadReposAndRequests() {
    setLoading(true);
    try {
      // Fetch repositories (pending approval and locked)
      const res = await axios.get("http://localhost:5000/api/repositories");
      const allRepos = res.data.repos || [];
      const pending = allRepos.filter((r) => r.requested === true && !r.is_locked);
      const locked = allRepos.filter((r) => r.is_locked === true);
      setReposPending(pending);
      setReposLocked(locked);

      // Fetch verification requests
      try {
        const v = await axios.get("http://localhost:5000/api/admin/verification");
        setVerifications(v.data || []);
      } catch (e) {
        setVerifications([]);
      }

      // Fetch reports
      try {
        const rep = await axios.get("http://localhost:5000/api/admin/reports");
        setReports(rep.data || []);
      } catch (e) {
        setReports([]);
      }
    } finally {
      setLoading(false);
    }
  }

  // Approve & Lock Repository
  async function approveRepo(id) {
    if (!confirm("Approve and LOCK this project?")) return;
    try {
      await axios.patch(`http://localhost:5000/api/repositories/${id}/lock`, {
        adminId: userId,
      });
      alert("Repository approved and locked.");
      loadReposAndRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Error approving");
    }
  }

  if (loading) return <h2>Loading admin dashboard...</h2>;
  if (role !== "adm") return <h2>Unauthorized — Admin only</h2>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>

      {/* ======================= PENDING APPROVAL ======================= */}
      <section style={section}>
        <h2>⏳ Pending Approval</h2>
        {reposPending.length === 0 && <p>No repositories are waiting for approval.</p>}
        {reposPending.map((repo) => (
          <div key={repo._id} style={card}>
            <h3>{repo.title}</h3>
            <p>{repo.description}</p>
            <p><b>Created by:</b> {repo.createdBy?.email}</p>
            <button style={btnApprove} onClick={() => approveRepo(repo._id)}>
              Approve & Lock
            </button>
            <button style={btn} onClick={() => (window.location.href = `/repositories/${repo._id}`)}>
              View Repository
            </button>
          </div>
        ))}
      </section>

      {/* ======================= LOCKED REPOSITORIES ======================= */}
      <section style={section}>
        <h2>🔒 Approved (Locked) Repositories</h2>
        {reposLocked.length === 0 && <p>No locked repositories yet.</p>}
        {reposLocked.map((repo) => (
          <div key={repo._id} style={card}>
            <h3>{repo.title}</h3>
            <p>{repo.description}</p>
            <p><b>Created by:</b> {repo.createdBy?.email}</p>
            <button style={btn} onClick={() => (window.location.href = `/repositories/${repo._id}`)}>
              View Repository
            </button>
          </div>
        ))}
      </section>

      {/* ======================= VERIFICATION REQUESTS ======================= */}
      <section style={section}>
        <h2>🔎 Verification requests</h2>
        {verifications.length === 0 && <p>No pending verifications.</p>}
        {verifications.map((v) => (
          <div key={v._id} style={card}>
            <p><b>User:</b> {v.userEmail || v.user || "—"}</p>
            <p><b>Submitted:</b> {v.createdAt ? new Date(v.createdAt).toLocaleString() : "—"}</p>
            <div>
              <button style={btn} onClick={() => window.location.href = `/admin/verification/${v._id}`}>
                Review
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ======================= REPORTS ======================= */}
      <section style={section}>
        <h2>🚩 Reports</h2>
        {reports.length === 0 && <p>No reports.</p>}
        {reports.map((rp) => (
          <div key={rp._id} style={card}>
            <p><b>Type:</b> {rp.type || "report"}</p>
            <p><b>About:</b> {rp.target || "—"}</p>
            <div>
              <button style={btn} onClick={() => window.location.href = `/admin/reports/${rp._id}`}>
                Review
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ---------- STYLES ---------- */
const section = {
  background: "#fafafa",
  padding: 18,
  borderRadius: 8,
  marginTop: 20,
};

const card = {
  background: "white",
  padding: 12,
  borderRadius: 8,
  marginBottom: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const btn = {
  padding: "8px 12px",
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginRight: 10,
};

const btnApprove = {
  padding: "8px 12px",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginRight: 10,
};








