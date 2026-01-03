

import { useEffect, useState } from "react";
import axios from "axios";

export default function SPDashboard() {
  const [myRepos, setMyRepos] = useState([]);
  const [collabRepos, setCollabRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;
    loadData();
  }, [userId]);

  async function loadData() {
    try {
      const created = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/repositories/by-sp?userId=${userId}`
      );

      const collab = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/repositories/by-collaborator?userId=${userId}`
      );

      setMyRepos(created.data.repos || []);
      setCollabRepos(collab.data.repos || []);
    } catch (err) {
      console.error(err);
      alert("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  }

  function getNotifications(repo) {
    let notes = [];

    const unanswered = repo.queries.filter(q => !q.answer);
    if (unanswered.length > 0)
      notes.push(`${unanswered.length} unanswered queries`);

    if (repo.checklist.todo.length > 0)
      notes.push(`${repo.checklist.todo.length} tasks in To-Do`);

    if (repo.checklist.ongoing.length > 0)
      notes.push(`${repo.checklist.ongoing.length} tasks in Ongoing`);

    return notes;
  }


  const openMyRepos = myRepos.filter(repo => !repo.is_locked);
  const openCollabRepos = collabRepos.filter(repo => !repo.is_locked);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 30 }}>
      <h1>Service Provider Dashboard</h1>
      <h3>Welcome, {localStorage.getItem("email")}</h3>

      <hr />

      {/* ================= MY REPOSITORIES ================= */}
      <h2>Your Repositories</h2>

      {openMyRepos.length === 0 && (
        <p>No open repositories yet.</p>
      )}

      {openMyRepos.slice(0, 3).map(repo => (
        <div
          key={repo._id}
          style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}
        >
          <h3>{repo.title}</h3>
          <p>Status: OPEN</p>

          <p><b>Notifications:</b></p>
          <ul>
            {getNotifications(repo).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>

          <button
            onClick={() =>
              (window.location.href = `/repositories/${repo._id}`)
            }
          >
            View Repository
          </button>
        </div>
      ))}

      <hr />

      {/* ================= COLLABORATING ================= */}
      <h2>Collaborating On</h2>

      {openCollabRepos.length === 0 && (
        <p>No open collaborations yet.</p>
      )}

      {openCollabRepos.slice(0, 3).map(repo => (
        <div
          key={repo._id}
          style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}
        >
          <h3>{repo.title}</h3>
          <p>Status: OPEN</p>

          <p><b>Notifications:</b></p>
          <ul>
            {getNotifications(repo).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>

          <button
            onClick={() =>
              (window.location.href = `/repositories/${repo._id}`)
            }
          >
            View Repository
          </button>
        </div>
      ))}
    </div>
  );
}
