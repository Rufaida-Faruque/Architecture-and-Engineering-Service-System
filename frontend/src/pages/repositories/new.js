import { useState, useEffect } from "react";
import axios from "axios";

export default function NewRepo() {
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    industrySector: "",
    projectType: "",
    tags: "",
    view: "private"
  });

  const [clientEmail, setClientEmail] = useState("");
  const [collabEmail, setCollabEmail] = useState("");

  const [clients, setClients] = useState([]); // store emails
  const [collaborators, setCollaborators] = useState([]); // store emails

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);


  function handleAddClient() {
    if (!clientEmail) return alert("Enter client email");

    if (clients.includes(clientEmail)) {
      alert("Client already added");
      return;
    }

    setClients([...clients, clientEmail]);
    setClientEmail("");
  }

  function handleAddCollaborator() {
    if (!collabEmail) return alert("Enter collaborator email");

    if (collaborators.includes(collabEmail)) {
      alert("Collaborator already added");
      return;
    }

    setCollaborators([...collaborators, collabEmail]);
    setCollabEmail("");
  }

  function removeClient(email) {
    setClients(clients.filter(c => c !== email));
  }

  function removeCollaborator(email) {
    setCollaborators(collaborators.filter(c => c !== email));
  }

  async function handleCreateRepo() {
    if (!form.title) return alert("Title required");
    if (!form.description) return alert("Description required");
    if (clients.length === 0) return alert("At least one client required");

    const payload = {
      title: form.title,
      description: form.description,
      industrySector: form.industrySector,
      projectType: form.projectType,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      view: form.view,
      createdBy: userId,
      clients,          // EMAILS
      collaborators     // EMAILS
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/repositories/create`,
        payload
      );

      alert("Repository created successfully!");
      window.location.href = "/repositories";

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating repository");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Repository</h1>

      {/* Basic Info */}
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      /><br/><br/>

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      /><br/><br/>

      <input
        placeholder="Industry Sector (optional)"
        value={form.industrySector}
        onChange={e => setForm({ ...form, industrySector: e.target.value })}
      /><br/><br/>

      <input
        placeholder="Project Type (optional)"
        value={form.projectType}
        onChange={e => setForm({ ...form, projectType: e.target.value })}
      /><br/><br/>

      <input
        placeholder="Tags (comma separated, optional)"
        value={form.tags}
        onChange={e => setForm({ ...form, tags: e.target.value })}
      /><br/><br/>

      {/* View */}
      <label>Visibility</label><br/>
      <select
        value={form.view}
        onChange={e => setForm({ ...form, view: e.target.value })}
      >
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>

      <hr />

      {/* Clients */}
      <h3>Clients</h3>
      <input
        placeholder="Client email"
        value={clientEmail}
        onChange={e => setClientEmail(e.target.value)}
      />
      <button onClick={handleAddClient}>Add Client</button>

      <ul>
        {clients.map(email => (
          <li key={email}>
            {email}
            <button onClick={() => removeClient(email)}>Remove</button>
          </li>
        ))}
      </ul>

      <hr />

      {/* Collaborators */}
      <h3>Collaborators (SPs, optional)</h3>
      <input
        placeholder="Collaborator email"
        value={collabEmail}
        onChange={e => setCollabEmail(e.target.value)}
      />
      <button onClick={handleAddCollaborator}>Add Collaborator</button>

      <ul>
        {collaborators.map(email => (
          <li key={email}>
            {email}
            <button onClick={() => removeCollaborator(email)}>Remove</button>
          </li>
        ))}
      </ul>

      <hr />

      <button onClick={handleCreateRepo}>Create Repository</button>
    </div>
  );
}
