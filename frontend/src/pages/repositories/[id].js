

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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}`);
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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/checklist/add`, {
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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/checklist/move`, {
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
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/checklist/remove`, {
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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/add-client`, {
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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/remove-client`, {
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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/add-collaborator`, {
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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/remove-collaborator`, {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/request-close`,
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
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/lock`, {
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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/query`, {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/repositories/${id}/query/${index}/answer`,
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
