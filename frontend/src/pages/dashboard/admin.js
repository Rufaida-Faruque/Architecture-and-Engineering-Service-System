
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false); // Flag for client-side rendering
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const [reposPending, setReposPending] = useState([]);
  const [reposLocked, setReposLocked] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detect client
  useEffect(() => {
    setIsClient(true);
    const id = localStorage.getItem("userId");
    const r = localStorage.getItem("role");
    setUserId(id);
    setRole(r);
  }, []);

  // Load dashboard data


  // useEffect(() => {
  //   if (!isClient || !userId || role !== "adm") return;

  //   const loadData = async () => {
  //     setLoading(true);
  //     try {
  //       // Repositories
  //       const res = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/repositories`
  //       );
  //       const allRepos = res.data.repos || [];
  //       setReposPending(allRepos.filter((r) => r.requested && !r.is_locked));
  //       setReposLocked(allRepos.filter((r) => r.is_locked));

  //       // Verification requests
  //       const vRes = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/admin/verification`
  //       );
  //       setVerifications(vRes.data || []);

  //       // Reports
  //       const rRes = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports`
  //       );
  //       setReports(rRes.data || []);
  //     } catch (err) {
  //       console.error("Admin dashboard load error:", err);
  //       setReposPending([]);
  //       setReposLocked([]);
  //       setVerifications([]);
  //       setReports([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [isClient, userId, role]);


  // Load dashboard data
useEffect(() => {
  if (!isClient || !userId || role !== "adm") return;

  const loadData = async () => {
    setLoading(true);
    try {
      // Repositories
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/repositories`
      );
      const allRepos = res.data.repos || [];
      setReposPending(allRepos.filter((r) => r.requested && !r.is_locked));
      setReposLocked(allRepos.filter((r) => r.is_locked));

      // Verification requests (feature not implemented yet)
      setVerifications([]); // always empty

      // Reports (feature not implemented yet)
      setReports([]); // always empty
    } catch (err) {
      console.error("Admin dashboard load error:", err);
      setReposPending([]);
      setReposLocked([]);
      setVerifications([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [isClient, userId, role]);


  // Approve & Lock Repository
  async function approveRepo(id) {
    if (!confirm("Approve and LOCK this project?")) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/lock`,
        { adminId: userId }
      );
      alert("Repository approved and locked.");
      // Reload repositories
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/repositories`
      );
      const allRepos = res.data.repos || [];
      setReposPending(allRepos.filter((r) => r.requested && !r.is_locked));
      setReposLocked(allRepos.filter((r) => r.is_locked));
    } catch (err) {
      alert(err.response?.data?.message || "Error approving repository");
    }
  }

  if (!isClient) return null; // Wait for client-side
  if (loading) return <h2>Loading admin dashboard...</h2>;
  if (role !== "adm") return <h2>Unauthorized — Admin only</h2>;

  return (
    <div style={{ padding: 25 }}>
      <h1>Admin Dashboard</h1>

      {/* Pending Approval */}
      <section style={section}>
        <h2>⏳ Pending Approval</h2>
        {reposPending.length === 0 && <p>No repositories waiting for approval.</p>}
        {reposPending.map((repo) => (
          <div key={repo._id} style={card}>
            <h3>{repo.title}</h3>
            <p>{repo.description}</p>
            <p><b>Created by:</b> {repo.createdBy?.email || "—"}</p>
            <button style={btnApprove} onClick={() => approveRepo(repo._id)}>
              Approve & Lock
            </button>
            <button
              style={btn}
              onClick={() =>
                (window.location.href = `/repositories/${repo._id}`)
              }
            >
              View Repository
            </button>
          </div>
        ))}
      </section>

      {/* Locked Repositories */}
      <section style={section}>
        <h2>🔒 Locked Repositories</h2>
        {reposLocked.length === 0 && <p>No locked repositories yet.</p>}
        {reposLocked.map((repo) => (
          <div key={repo._id} style={card}>
            <h3>{repo.title}</h3>
            <p>{repo.description}</p>
            <p><b>Created by:</b> {repo.createdBy?.email || "—"}</p>
            <button
              style={btn}
              onClick={() =>
                (window.location.href = `/repositories/${repo._id}`)
              }
            >
              View Repository
            </button>
          </div>
        ))}
      </section>

      {/* Verification Requests */}
      <section style={section}>
        <h2>🔎 Verification Requests</h2>
        {verifications.length === 0 && <p>No pending verifications.(Feature not implemented)</p>}
        {verifications.map((v) => (
          <div key={v._id} style={card}>
            <p><b>User:</b> {v.userEmail || v.user || "—"}</p>
            <p>
              <b>Submitted:</b>{" "}
              {v.createdAt ? new Date(v.createdAt).toLocaleString() : "—"}
            </p>
            <button
              style={btn}
              onClick={() =>
                (window.location.href = `/admin/verification/${v._id}`)
              }
            >
              Review
            </button>
          </div>
        ))}
      </section>

      {/* Reports */}
      <section style={section}>
        <h2>🚩 Reports</h2>
        {reports.length === 0 && <p>No reports.(Feature not implemented)</p>}
        {reports.map((rp) => (
          <div key={rp._id} style={card}>
            <p><b>Type:</b> {rp.type || "report"}</p>
            <p><b>About:</b> {rp.target || "—"}</p>
            <button
              style={btn}
              onClick={() => (window.location.href = `/admin/reports/${rp._id}`)}
            >
              Review
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ---------- STYLES ---------- */
const section = {
  background: "#f4f4f4",
  padding: 20,
  borderRadius: 10,
  marginTop: 20,
};

const card = {
  background: "white",
  padding: 15,
  borderRadius: 8,
  marginBottom: 15,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const btn = {
  padding: "8px 14px",
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
  marginRight: 10,
};

const btnApprove = {
  padding: "8px 14px",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
  marginRight: 10,
};
