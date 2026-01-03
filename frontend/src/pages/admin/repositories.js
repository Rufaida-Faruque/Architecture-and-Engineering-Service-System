import { useEffect, useState } from "react";
import axios from "axios";

export default function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId");
      const r = localStorage.getItem("role");
      setUserId(id);
      setRole(r);

      if (id) fetchRepositories(id, r);
    }
  }, []);

  async function fetchRepositories(id, role) {
    try {
      let res;

      if (role === "sp") {
        // Service Provider → repositories they created or collaborate in
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/by-sp`, {
          params: { userId: id }
        });
      } else if (role === "cl") {
        // Client → repositories they are part of
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/by-client`, {
          params: { userId: id }
        });
      }

      setRepos(res.data.repos);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (loading) return <p>Loading repositories...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Repositories</h1>

      {repos.length === 0 && <p>No repositories found.</p>}

      {repos.map(repo => (
        <div
          key={repo._id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 5
          }}
        >
          <h3>{repo.title}</h3>
          <p>{repo.description}</p>

          <button
            onClick={() => { window.location.href = `/repositories/${repo._id}`; }}
          >
            View Repository
          </button>
        </div>
      ))}
    </div>
  );
}
