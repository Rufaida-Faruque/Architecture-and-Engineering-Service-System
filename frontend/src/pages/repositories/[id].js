// // // import { useRouter } from "next/router";
// // // import { useEffect, useState } from "react";
// // // import axios from "axios";

// // // export default function RepoView() {
// // //   const router = useRouter();
// // //   const { id } = router.query;

// // //   const [repo, setRepo] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     if (!id) return;

// // //     axios.get(`http://localhost:5000/api/repositories/${id}`)
// // //       .then(res => {
// // //         setRepo(res.data.repo);
// // //         setLoading(false);
// // //       })
// // //       .catch(err => {
// // //         console.error(err);
// // //         setLoading(false);
// // //       });

// // //   }, [id]);

// // //   if (loading) return <h2>Loading...</h2>;
// // //   if (!repo) return <h2>Repository not found</h2>;

// // //   return (
// // //     <div style={{ padding: 20 }}>
// // //       <h1>{repo.title}</h1>
// // //       <p><strong>Description:</strong> {repo.description}</p>

// // //       <p><strong>Industry Sector:</strong> {repo.industrySector}</p>
// // //       <p><strong>Project Type:</strong> {repo.projectType}</p>
// // //       <p><strong>Tags:</strong> {repo.tags.join(", ")}</p>

// // //       <h3>Created By</h3>
// // //       <p>{repo.createdBy?.email}</p>

// // //       <h3>Clients</h3>
// // //       <ul>
// // //         {repo.clients?.map(c => (
// // //           <li key={c._id}>{c.email}</li>
// // //         ))}
// // //       </ul>

// // //       <h3>Collaborators</h3>
// // //       <ul>
// // //         {repo.collaborators?.map(col => (
// // //           <li key={col._id}>{col.email}</li>
// // //         ))}
// // //       </ul>

// // //       <h3>Checklist</h3>
// // //       <p><b>To Do:</b> {repo.checklist?.todo?.join(", ")}</p>
// // //       <p><b>Ongoing:</b> {repo.checklist?.ongoing?.join(", ")}</p>
// // //       <p><b>Completed:</b> {repo.checklist?.completed?.join(", ")}</p>

// // //       <h3>Queries</h3>
// // //       <ul>
// // //         {repo.queries?.map((q, i) => (
// // //           <li key={i}>
// // //             <b>Q:</b> {q.question}<br/>
// // //             <b>A:</b> {q.answer || "(unanswered)"}
// // //           </li>
// // //         ))}
// // //       </ul>

// // //       <h3>Dates</h3>
// // //       <p>Start: {new Date(repo.startDate).toLocaleDateString()}</p>
// // //       <p>End: {repo.endDate ? new Date(repo.endDate).toLocaleDateString() : "Ongoing"}</p>

// // //       <h3>Visibility</h3>
// // //       <p>{repo.view}</p>

// // //       <h3>Documents</h3>
// // //       <ul>
// // //         {repo.documents?.map((d, i) => (
// // //           <li key={i}>
// // //             <a href={d.url} target="_blank">{d.originalname}</a>
// // //           </li>
// // //         ))}
// // //       </ul>

// // //       {/* SP ONLY EDIT BUTTON */}
// // //       {localStorage.getItem("role") === "sp" && repo.createdBy?._id === localStorage.getItem("userId") && (
// // //         <button
// // //           style={{ marginTop: 20 }}
// // //           onClick={() => router.push(`/repositories/edit/${repo._id}`)}
// // //         >
// // //           Edit Repository
// // //         </button>
// // //       )}
// // //     </div>
    
// // //   );
// // // }
// // import { useRouter } from "next/router";
// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // export default function RepoView() {
// //   const router = useRouter();
// //   const { id } = router.query;

// //   const [repo, setRepo] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // NEW — For queries
// //   const [newQuery, setNewQuery] = useState("");

// //   // Fetch repository
// //   useEffect(() => {
// //     if (!id) return;

// //     axios.get(`http://localhost:5000/api/repositories/${id}`)
// //       .then(res => {
// //         setRepo(res.data.repo);
// //         setLoading(false);
// //       })
// //       .catch(err => {
// //         console.error(err);
// //         setLoading(false);
// //       });

// //   }, [id]);

// //   // NEW — Add query (CLIENT)
// //   const submitQuery = async () => {
// //     if (!newQuery.trim()) return alert("Enter a question");

// //     await axios.post(`http://localhost:5000/api/repositories/${id}/query`, {
// //       userId: localStorage.getItem("userId"),
// //       question: newQuery
// //     });

// //     alert("Query sent!");
// //     window.location.reload();
// //   };

// //   // NEW — Answer query (SP)
// //   const answerQuery = async (qIndex, answer) => {
// //     await axios.post(
// //       `http://localhost:5000/api/repositories/${id}/query/${qIndex}/answer`,
// //       {
// //         userId: localStorage.getItem("userId"),
// //         answer
// //       }
// //     );

// //     alert("Answer saved!");
// //     window.location.reload();
// //   };

// //   if (loading) return <h2>Loading...</h2>;
// //   if (!repo) return <h2>Repository not found</h2>;

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h1>{repo.title}</h1>
// //       <p><strong>Description:</strong> {repo.description}</p>

// //       <p><strong>Industry Sector:</strong> {repo.industrySector}</p>
// //       <p><strong>Project Type:</strong> {repo.projectType}</p>
// //       <p><strong>Tags:</strong> {repo.tags.join(", ")}</p>

// //       <h3>Created By</h3>
// //       <p>{repo.createdBy?.email}</p>

// //       <h3>Clients</h3>
// //       <ul>
// //         {repo.clients?.map(c => (
// //           <li key={c._id}>{c.email}</li>
// //         ))}
// //       </ul>

// //       <h3>Collaborators</h3>
// //       <ul>
// //         {repo.collaborators?.map(col => (
// //           <li key={col._id}>{col.email}</li>
// //         ))}
// //       </ul>

// //       <h3>Checklist</h3>
// //       <p><b>To Do:</b> {repo.checklist?.todo?.join(", ")}</p>
// //       <p><b>Ongoing:</b> {repo.checklist?.ongoing?.join(", ")}</p>
// //       <p><b>Completed:</b> {repo.checklist?.completed?.join(", ")}</p>

// //       {/* ------------------------- */}
// //       {/*        QUERIES            */}
// //       {/* ------------------------- */}

// //       <h3>Queries</h3>
// //       <ul>
// //         {repo.queries?.map((q, i) => (
// //           <li key={i} style={{ marginBottom: 15 }}>
// //             <b>Q:</b> {q.question} <br />
// //             <b>A:</b> {q.answer || "(unanswered)"} <br />

// //             {/* SP sees answer button ONLY when unanswered */}
// //             {localStorage.getItem("role") === "sp" && !q.answer && (
// //               <button
// //                 style={{ marginTop: 5 }}
// //                 onClick={() => {
// //                   const ans = prompt("Enter answer:");
// //                   if (ans) answerQuery(i, ans);
// //                 }}
// //               >
// //                 Answer
// //               </button>
// //             )}
// //           </li>
// //         ))}
// //       </ul>

// //       {/* CLIENT question input */}
// //       {localStorage.getItem("role") === "client" && (
// //         <div style={{ marginTop: 20 }}>
// //           <textarea
// //             placeholder="Ask a question..."
// //             style={{ width: "100%", height: 60 }}
// //             onChange={(e) => setNewQuery(e.target.value)}
// //           ></textarea>
// //           <button onClick={submitQuery}>Send Question</button>
// //         </div>
// //       )}

// //       <h3>Dates</h3>
// //       <p>Start: {new Date(repo.startDate).toLocaleDateString()}</p>
// //       <p>End: {repo.endDate ? new Date(repo.endDate).toLocaleDateString() : "Ongoing"}</p>

// //       <h3>Visibility</h3>
// //       <p>{repo.view}</p>

// //       <h3>Documents</h3>
// //       <ul>
// //         {repo.documents?.map((d, i) => (
// //           <li key={i}>
// //             <a href={d.url} target="_blank">{d.originalname}</a>
// //           </li>
// //         ))}
// //       </ul>

// //       {/* SP ONLY EDIT BUTTON */}
// //       {localStorage.getItem("role") === "sp" &&
// //         repo.createdBy?._id === localStorage.getItem("userId") && (
// //           <button
// //             style={{ marginTop: 20 }}
// //             onClick={() => router.push(`/repositories/edit/${repo._id}`)}
// //           >
// //             Edit Repository
// //           </button>
// //         )}
// //     </div>
// //   );
// // }












// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function RepoView() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [repo, setRepo] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // checklist input
//   const [taskText, setTaskText] = useState("");

//   // client / collaborator inputs
//   const [clientEmail, setClientEmail] = useState("");
//   const [collabEmail, setCollabEmail] = useState("");

//   // new query supporting from previous implementation
//   const [newQuery, setNewQuery] = useState("");

//   useEffect(() => {
//     if (!id) return;
//     loadRepo();
//   }, [id]);

//   async function loadRepo() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:5000/api/repositories/${id}`);
//       setRepo(res.data.repo);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to load repository");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // checklist handlers
//   async function addTask(section) {
//     if (!taskText.trim()) return alert("Enter task");
//     try {
//       await axios.post(`http://localhost:5000/api/repositories/${id}/checklist/add`, {
//         userId: localStorage.getItem("userId"),
//         task: taskText,
//         section
//       });
//       setTaskText("");
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error adding task");
//     }
//   }

//   async function moveTask(task, from, to) {
//     try {
//       await axios.patch(`http://localhost:5000/api/repositories/${id}/checklist/move`, {
//         userId: localStorage.getItem("userId"),
//         task,
//         from,
//         to
//       });
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error moving task");
//     }
//   }

//   async function removeTask(task, section) {
//     try {
//       await axios.delete(`http://localhost:5000/api/repositories/${id}/checklist/remove`, {
//         data: { userId: localStorage.getItem("userId"), task, section }
//       });
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error removing task");
//     }
//   }

//   // client / collaborator handlers
//   async function handleAddClient() {
//     if (!clientEmail.trim()) return alert("Enter email");
//     try {
//       await axios.patch(`http://localhost:5000/api/repositories/${id}/add-client`, {
//         userId: localStorage.getItem("userId"),
//         email: clientEmail
//       });
//       setClientEmail("");
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error adding client");
//     }
//   }

//   async function handleRemoveClient(clientId) {
//     if (!confirm("Remove client?")) return;
//     try {
//       await axios.patch(`http://localhost:5000/api/repositories/${id}/remove-client`, {
//         userId: localStorage.getItem("userId"),
//         clientId
//       });
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error removing client");
//     }
//   }

//   async function handleAddCollaborator() {
//     if (!collabEmail.trim()) return alert("Enter email");
//     try {
//       await axios.patch(`http://localhost:5000/api/repositories/${id}/add-collaborator`, {
//         userId: localStorage.getItem("userId"),
//         email: collabEmail
//       });
//       setCollabEmail("");
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error adding collaborator");
//     }
//   }

//   async function handleRemoveCollaborator(collabId) {
//     if (!confirm("Remove collaborator?")) return;
//     try {
//       await axios.patch(`http://localhost:5000/api/repositories/${id}/remove-collaborator`, {
//         userId: localStorage.getItem("userId"),
//         collaboratorId: collabId
//       });
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error removing collaborator");
//     }
//   }

//   // admin lock
//   async function lockRepo() {
//     if (!confirm("Lock this repository? This is irreversible.")) return;
//     try {
//       await axios.patch(`http://localhost:5000/api/repositories/${id}/lock`, {
//         adminId: localStorage.getItem("userId")
//       });
//       alert("Repository locked");
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Error locking repository");
//     }
//   }

//   // queries: reuse existing functions (client ask and SP answer)
//   async function submitQuery() {
//     if (!newQuery.trim()) return alert("Enter a question");
//     try {
//       await axios.post(`http://localhost:5000/api/repositories/${id}/query`, {
//         userId: localStorage.getItem("userId"),
//         question: newQuery
//       });
//       setNewQuery("");
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert("Error sending query");
//     }
//   }

//   async function answerQuery(qIndex) {
//     const ans = prompt("Enter your answer:");
//     if (!ans) return;
//     try {
//       await axios.post(`http://localhost:5000/api/repositories/${id}/query/${qIndex}/answer`, {
//         userId: localStorage.getItem("userId"),
//         answer: ans
//       });
//       await loadRepo();
//     } catch (err) {
//       console.error(err);
//       alert("Error saving answer");
//     }
//   }

//   if (loading) return <p>Loading...</p>;
//   if (!repo) return <p>Repository not found</p>;

//   const role = localStorage.getItem("role");
//   const userId = localStorage.getItem("userId");
//   const isCreator = repo.createdBy && (repo.createdBy._id || repo.createdBy).toString() === userId;
//   const isCollaborator = (repo.collaborators || []).some(c => (c._id || c).toString() === userId);

//   const canEdit = (role === "sp") && (isCreator || isCollaborator) && !repo.is_locked;

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>{repo.title} {repo.is_locked && <span style={{ color: "red" }}>(LOCKED)</span>}</h1>
//       <p><strong>Description:</strong> {repo.description}</p>

//       <h3>Checklist</h3>
//       <div style={{ marginBottom: 10 }}>
//         <input placeholder="New task" value={taskText} onChange={e => setTaskText(e.target.value)} />
//         <button onClick={() => addTask("todo")}>Add to To-Do</button>
//       </div>

//       <div style={{ display: "flex", gap: 20 }}>
//         <div>
//           <h4>To Do</h4>
//           <ul>
//             {repo.checklist?.todo?.map(t => (
//               <li key={t}>
//                 {t}
//                 {canEdit && <><button onClick={() => moveTask(t, "todo", "ongoing")}>Start</button>
//                 <button onClick={() => moveTask(t, "todo", "completed")}>Complete</button>
//                 <button onClick={() => removeTask(t, "todo")}>Delete</button></>}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div>
//           <h4>Ongoing</h4>
//           <ul>
//             {repo.checklist?.ongoing?.map(t => (
//               <li key={t}>
//                 {t}
//                 {canEdit && <><button onClick={() => moveTask(t, "ongoing", "completed")}>Complete</button>
//                 <button onClick={() => moveTask(t, "ongoing", "todo")}>Back</button>
//                 <button onClick={() => removeTask(t, "ongoing")}>Delete</button></>}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div>
//           <h4>Completed</h4>
//           <ul>
//             {repo.checklist?.completed?.map(t => (
//               <li key={t}>
//                 {t}
//                 {canEdit && <button onClick={() => removeTask(t, "completed")}>Delete</button>}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <hr />

//       <h3>Clients</h3>
//       <ul>
//         {repo.clients?.map(c => (
//           <li key={c._id}>
//             {c.email}
//             {canEdit && <button onClick={() => handleRemoveClient(c._id)}>Remove</button>}
//           </li>
//         ))}
//       </ul>

//       {canEdit && (
//         <div>
//           <input placeholder="Client email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
//           <button onClick={handleAddClient}>Add Client</button>
//         </div>
//       )}

//       <hr />

//       <h3>Collaborators</h3>
//       <ul>
//         {repo.collaborators?.map(c => (
//           <li key={c._id}>
//             {c.email}
//             {canEdit && <button onClick={() => handleRemoveCollaborator(c._id)}>Remove</button>}
//           </li>
//         ))}
//       </ul>

//       {canEdit && (
//         <div>
//           <input placeholder="Collaborator email" value={collabEmail} onChange={e => setCollabEmail(e.target.value)} />
//           <button onClick={handleAddCollaborator}>Add Collaborator</button>
//         </div>
//       )}

//       <hr />

//       <h3>Queries</h3>
//       <ul>
//         {repo.queries?.map((q, i) => (
//           <li key={i}>
//             <b>Q:</b> {q.question} <br />
//             <b>A:</b> {q.answer || "(unanswered)"}
//             {role === "sp" && !q.answer && canEdit && <button onClick={() => answerQuery(i)}>Answer</button>}
//           </li>
//         ))}
//       </ul>

//       {role === "cl" && (
//         <div>
//           <textarea placeholder="Ask a question..." value={newQuery} onChange={e => setNewQuery(e.target.value)} />
//           <button onClick={submitQuery}>Send Question</button>
//         </div>
//       )}

//       <hr />

//       <h3>Admin</h3>
//       {localStorage.getItem("role") === "adm" && !repo.is_locked && (
//         <button onClick={lockRepo}>Lock / Approve Repository</button>
//       )}

//       <hr />

//       <p><b>Visibility:</b> {repo.view}</p>
//     </div>
//   );
// }




import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RepoView() {
  const router = useRouter();
  const { id } = router.query;

  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  // form inputs
  const [taskText, setTaskText] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [collabEmail, setCollabEmail] = useState("");
  const [newQuery, setNewQuery] = useState("");

  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!id) return;
    loadRepo();
  }, [id]);

  async function loadRepo() {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/repositories/${id}`);
      setRepo(res.data.repo);
    } catch (err) {
      console.error(err);
      alert("Failed to load repository");
    }
    setLoading(false);
  }

  // CHECK PERMISSIONS
  const isCreator =
    repo?.createdBy && (repo.createdBy._id || repo.createdBy).toString() === userId;

  const isCollaborator =
    repo?.collaborators?.some(c => (c._id || c).toString() === userId);

  // SP can edit ONLY IF creator or collaborator AND not locked
  const canEdit =
    role === "sp" &&
    (isCreator || isCollaborator) &&
    !repo?.is_locked;

  // CHECKLIST HANDLERS
  async function addTask(section) {
    if (!taskText.trim()) return alert("Enter a task");
    try {
      await axios.post(`http://localhost:5000/api/repositories/${id}/checklist/add`, {
        userId,
        task: taskText,
        section
      });
      setTaskText("");
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  async function moveTask(task, from, to) {
    try {
      await axios.patch(`http://localhost:5000/api/repositories/${id}/checklist/move`, {
        userId,
        task,
        from,
        to
      });
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  async function removeTask(task, section) {
    try {
      await axios.delete(`http://localhost:5000/api/repositories/${id}/checklist/remove`, {
        data: { userId, task, section }
      });
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  // CLIENT / COLLABORATOR MANAGEMENT
  async function addClient() {
    if (!clientEmail.trim()) return alert("Enter email");
    try {
      await axios.patch(`http://localhost:5000/api/repositories/${id}/add-client`, {
        userId,
        email: clientEmail
      });
      setClientEmail("");
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  async function removeClient(clientId) {
    if (!confirm("Remove client?")) return;
    try {
      await axios.patch(`http://localhost:5000/api/repositories/${id}/remove-client`, {
        userId,
        clientId
      });
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  async function addCollaborator() {
    if (!collabEmail.trim()) return alert("Enter email");
    try {
      await axios.patch(`http://localhost:5000/api/repositories/${id}/add-collaborator`, {
        userId,
        email: collabEmail
      });
      setCollabEmail("");
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  async function removeCollaborator(collabId) {
    if (!confirm("Remove collaborator?")) return;
    try {
      await axios.patch(`http://localhost:5000/api/repositories/${id}/remove-collaborator`, {
        userId,
        collaboratorId: collabId
      });
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }
  // SP REQUEST TO CLOSE PROJECT
  async function requestClose() {
    if (!confirm("Request Admin to close and lock this project?")) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/repositories/${id}/request-close`,
        { userId }
      );

      alert("Close request sent to admin.");
      loadRepo();
    } catch (err) {
      console.error(err);
      alert("Failed to send request.");
    }
  }

  // ADMIN LOCK
  async function lockRepo() {
    if (!confirm("Lock this repository? This cannot be undone.")) return;
    try {
      await axios.patch(`http://localhost:5000/api/repositories/${id}/lock`, {
        adminId: userId
      });
      alert("Repository locked");
      loadRepo();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  }

  // QUERIES
  async function submitQuery() {
    if (!newQuery.trim()) return alert("Enter a question");
    try {
      await axios.post(`http://localhost:5000/api/repositories/${id}/query`, {
        userId,
        question: newQuery
      });
      setNewQuery("");
      loadRepo();
    } catch {
      alert("Error sending query");
    }
  }

  async function answerQuery(index) {
    const ans = prompt("Enter answer:");
    if (!ans?.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/repositories/${id}/query/${index}/answer`,
        { userId, answer: ans }
      );
      loadRepo();
    } catch {
      alert("Error saving answer");
    }
  }

  // RENDER
  if (loading) return <h2>Loading...</h2>;
  if (!repo) return <h2>Repository not found</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>
        {repo.title}{" "}
        {repo.is_locked && <span style={{ color: "red" }}>(LOCKED)</span>}
      </h1>

      <p><b>Description:</b> {repo.description}</p>

            {/* ---------------- CLOSE REQUEST (SP OWNER ONLY) ---------------- */}
      {role === "sp" &&
        isCreator &&
        !repo.is_locked &&
        repo.requested !== true && (
          <button
            onClick={requestClose}
            style={{
              background: "orange",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "20px"
            }}
          >
            Request to Close Project
          </button>
      )}

      {/* Show badge when request already sent */}
      {repo.requested === true && !repo.is_locked && (
        <p style={{ color: "orange", fontWeight: "bold" }}>
          Close request pending admin approval...
        </p>
      )}



      {/* ---------------- CHECKLIST ---------------- */}
      <h3>Checklist</h3>

      {canEdit && (
        <div>
          <input
            value={taskText}
            onChange={e => setTaskText(e.target.value)}
            placeholder="New task"
          />
          <button onClick={() => addTask("todo")}>Add to To Do</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 30 }}>
        {/* TO DO */}
        <div>
          <h4>To Do</h4>
          <ul>
            {repo.checklist.todo.map(task => (
              <li key={task}>
                {task}
                {canEdit && (
                  <>
                    <button onClick={() => moveTask(task, "todo", "ongoing")}>Start</button>
                    <button onClick={() => moveTask(task, "todo", "completed")}>Complete</button>
                    <button onClick={() => removeTask(task, "todo")}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ONGOING */}
        <div>
          <h4>Ongoing</h4>
          <ul>
            {repo.checklist.ongoing.map(task => (
              <li key={task}>
                {task}
                {canEdit && (
                  <>
                    <button onClick={() => moveTask(task, "ongoing", "completed")}>Complete</button>
                    <button onClick={() => moveTask(task, "ongoing", "todo")}>Back</button>
                    <button onClick={() => removeTask(task, "ongoing")}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* COMPLETED */}
        <div>
          <h4>Completed</h4>
          <ul>
            {repo.checklist.completed.map(task => (
              <li key={task}>
                {task}
                {canEdit && (
                  <button onClick={() => removeTask(task, "completed")}>Delete</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr />



      {/* ---------------- CLIENTS ---------------- */}
      <h3>Clients</h3>
      <ul>
        {repo.clients.map(c => (
          <li key={c._id}>
            {c.email}
            {canEdit && (
              <button onClick={() => removeClient(c._id)}>Remove</button>
            )}
          </li>
        ))}
      </ul>

      {canEdit && (
        <div>
          <input
            value={clientEmail}
            onChange={e => setClientEmail(e.target.value)}
            placeholder="Client email"
          />
          <button onClick={addClient}>Add Client</button>
        </div>
      )}

      <hr />

      {/* ---------------- COLLABORATORS ---------------- */}
      <h3>Collaborators</h3>
      <ul>
        {repo.collaborators.map(c => (
          <li key={c._id}>
            {c.email}
            {canEdit && (
              <button onClick={() => removeCollaborator(c._id)}>Remove</button>
            )}
          </li>
        ))}
      </ul>

      {canEdit && (
        <div>
          <input
            value={collabEmail}
            onChange={e => setCollabEmail(e.target.value)}
            placeholder="Collaborator email"
          />
          <button onClick={addCollaborator}>Add Collaborator</button>
        </div>
      )}

      <hr />

      {/* ---------------- QUERIES ---------------- */}
      <h3>Queries</h3>
      <ul>
        {repo.queries.map((q, index) => (
          <li key={index}>
            <b>Q:</b> {q.question} <br />
            <b>A:</b> {q.answer || "(unanswered)"} <br />
            {role === "sp" && !q.answer && canEdit && (
              <button onClick={() => answerQuery(index)}>Answer</button>
            )}
          </li>
        ))}
      </ul>

      {role === "cl" && (
        <div>
          <textarea
            value={newQuery}
            onChange={e => setNewQuery(e.target.value)}
            placeholder="Ask something..."
          />
          <button onClick={submitQuery}>Send</button>
        </div>
      )}

      <hr />

      {/* ---------------- ADMIN ---------------- */}
      {role === "adm" && !repo.is_locked && (
        <button onClick={lockRepo} style={{ background: "red", color: "white" }}>
          LOCK REPOSITORY
        </button>
      )}

      <hr />

      <p><b>Visibility:</b> {repo.view}</p>
    </div>
  );
}
