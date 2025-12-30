import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditRepository() {
  const router = useRouter();
  const { id } = router.query;

  const [repo, setRepo] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:5000/api/repositories/${id}`)
      .then(res => setRepo(res.data.repo));
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/repositories/${id}`, repo);
      alert("Repository updated!");
      router.push(`/repositories/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error updating repository.");
    }
  };

  if (!repo) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit Repository</h1>

      <label>Title</label>
      <input
        value={repo.title}
        onChange={(e) => setRepo({ ...repo, title: e.target.value })}
      />

      <label>Description</label>
      <textarea
        value={repo.description}
        onChange={(e) => setRepo({ ...repo, description: e.target.value })}
      />

      <label>Industry Sector</label>
      <input
        value={repo.industrySector}
        onChange={(e) => setRepo({ ...repo, industrySector: e.target.value })}
      />

      <label>Project Type</label>
      <input
        value={repo.projectType}
        onChange={(e) => setRepo({ ...repo, projectType: e.target.value })}
      />

      <label>Tags (comma separated)</label>
      <input
        value={repo.tags.join(", ")}
        onChange={(e) =>
          setRepo({ ...repo, tags: e.target.value.split(",").map(t => t.trim()) })
        }
      />

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}
