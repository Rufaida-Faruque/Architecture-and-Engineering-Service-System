import { useEffect, useState } from "react";
import axios from "axios";

export default function Repositories() {
  const [repos, setRepos] = useState([]);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    setUserId(id);
    setRole(role);

    if (!id || !role) return;

    loadRepositories(id, role);
  }, []);

  async function loadRepositories(uid, role) {
    try {
      let response;

      if (role === "cl") {
        // CLIENT → show client repositories
        response = await axios.get(
          `http://localhost:5000/api/repositories/by-client?userId=${uid}`
        );
      } else if (role === "sp") {
        // SERVICE PROVIDER → show repos they created or collaborate on
        response = await axios.get(
          `http://localhost:5000/api/repositories/by-sp?userId=${uid}`
        );
      } else if (role === "adm") {
        // ADMIN → see all repos
        response = await axios.get("http://localhost:5000/api/repositories/all");
      }

      setRepos(response.data.repos || []);
    } catch (err) {
      console.error("Error loading repos:", err);
      alert("Could not load repositories.");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Repositories</h1>

      {repos.length === 0 && <p>No repositories found.</p>}

      {repos.map(repo => (
        <div 
          key={repo._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <h3>{repo.title}</h3>
          <p>{repo.description}</p>
          
          <button
            onClick={() => window.location.href = `/repositories/${repo._id}`}
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
}
