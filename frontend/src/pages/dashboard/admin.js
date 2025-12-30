




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








