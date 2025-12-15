import { useEffect, useState } from "react";
import axios from "axios";

export default function SPDashboard() {
  const [myRepos, setMyRepos] = useState([]);
  const [collabRepos, setCollabRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    loadData();
  }, [userId]);

  async function loadData() {
    try {
      // repositories created by SP
      const created = await axios.get(
        `http://localhost:5000/api/repositories/by-sp?userId=${userId}`
      );

      // repositories collaborated by SP
      const collab = await axios.get(
        `http://localhost:5000/api/repositories/by-collaborator?userId=${userId}`
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

    // Unanswered queries
    const unanswered = repo.queries.filter(q => !q.answer);
    if (unanswered.length > 0)
      notes.push(`${unanswered.length} unanswered queries`);

    // Tasks in To-Do or Ongoing
    if (repo.checklist.todo.length > 0)
      notes.push(`${repo.checklist.todo.length} tasks in To-Do`);

    if (repo.checklist.ongoing.length > 0)
      notes.push(`${repo.checklist.ongoing.length} tasks in Ongoing`);

    return notes;
  }

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 30 }}>
      <h1>Service Provider Dashboard</h1>
      <h3>Welcome, {localStorage.getItem("email")}</h3>

      <hr />

      {/* My repositories */}
      <h2>Your Repositories</h2>
      {myRepos.length === 0 && <p>No repositories created yet.</p>}

      {myRepos.map(repo => (
        <div key={repo._id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
          <h3>{repo.title}</h3>

          <p>Status: {repo.is_locked ? "LOCKED" : "OPEN"}</p>

          <p><b>Notifications:</b></p>
          <ul>
            {getNotifications(repo).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>

          <button onClick={() => window.location.href = `/repositories/${repo._id}`}>
            View Repository
          </button>
        </div>
      ))}

      <hr />
      

      {/* Collaborating repositories */}
      <h2>Collaborating On</h2>
      {collabRepos.length === 0 && <p>No collaborations found.</p>}

      {collabRepos.map(repo => (
        <div key={repo._id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
          <h3>{repo.title}</h3>

          <p>Status: {repo.is_locked ? "LOCKED" : "OPEN"}</p>

          <p><b>Notifications:</b></p>
          <ul>
            {getNotifications(repo).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>

          <button onClick={() => window.location.href = `/repositories/${repo._id}`}>
            View Repository
          </button>
        </div>
      ))}
    </div>
  );
}



// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function SPDashboard() {
//   const [myRepos, setMyRepos] = useState([]);
//   const [collabRepos, setCollabRepos] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   useEffect(() => {
//     if (!userId) return;

//     loadData();
//   }, [userId]);

//   async function loadData() {
//     try {
//       // repositories created by SP
//       const created = await axios.get(
//         `http://localhost:5000/api/repositories/by-sp?userId=${userId}`
//       );

//       // repositories collaborated by SP
//       const collab = await axios.get(
//         `http://localhost:5000/api/repositories/by-collaborator?userId=${userId}`
//       );

//       setMyRepos(created.data.repos || []);
//       setCollabRepos(collab.data.repos || []);
//     } catch (err) {
//       console.error(err);
//       alert("Error loading dashboard");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function getNotifications(repo) {
//     let notes = [];

//     // Unanswered queries
//     const unanswered = repo.queries.filter(q => !q.answer);
//     if (unanswered.length > 0)
//       notes.push(`${unanswered.length} unanswered queries`);

//     // Tasks in To-Do or Ongoing
//     if (repo.checklist.todo.length > 0)
//       notes.push(`${repo.checklist.todo.length} tasks in To-Do`);

//     if (repo.checklist.ongoing.length > 0)
//       notes.push(`${repo.checklist.ongoing.length} tasks in Ongoing`);

//     return notes;
//   }

//   if (loading) return <h2>Loading...</h2>;

//   return (
//     <div style={{ padding: 30 }}>
//       <h1>Service Provider Dashboard</h1>
//       <h3>Welcome, {localStorage.getItem("email")}</h3>

//       <hr />

//       {/* My repositories */}
//       <h2>Your Repositories</h2>
//       {myRepos.length === 0 && <p>No repositories created yet.</p>}

//       {myRepos.map(repo => (
//         <div key={repo._id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
//           <h3>{repo.title}</h3>

//           <p>Status: {repo.is_locked ? "LOCKED" : "OPEN"}</p>

//           <p><b>Notifications:</b></p>
//           <ul>
//             {getNotifications(repo).map((n, i) => (
//               <li key={i}>{n}</li>
//             ))}
//           </ul>

//           <button onClick={() => window.location.href = `/repositories/${repo._id}`}>
//             View Repository
//           </button>
//         </div>
//       ))}

//       <hr />

//       {/* Collaborating repositories */}
//       <h2>Collaborating On</h2>
//       {collabRepos.length === 0 && <p>No collaborations found.</p>}

//       {collabRepos.map(repo => (
//         <div key={repo._id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
//           <h3>{repo.title}</h3>

//           <p>Status: {repo.is_locked ? "LOCKED" : "OPEN"}</p>

//           <p><b>Notifications:</b></p>
//           <ul>
//             {getNotifications(repo).map((n, i) => (
//               <li key={i}>{n}</li>
//             ))}
//           </ul>

//           <button onClick={() => window.location.href = `/repositories/${repo._id}`}>
//             View Repository
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
