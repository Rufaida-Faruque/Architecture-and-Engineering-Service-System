import { useState, useEffect } from "react";
import axios from "axios";

export default function CreatePortfolio() {
  const [userId, setUserId] = useState(null);

  // Portfolio form state
  const [form, setForm] = useState({
    profileDescription: "",
    skills: "",
    expertise: "",
    view: "private", // Default view set to private
  });

  // States for Skills and Expertise
  const [skills, setSkills] = useState("");
  const [expertise, setExpertise] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  // Handle form submission to create portfolio
  async function handleCreatePortfolio() {
    if (!form.profileDescription) return alert("Profile description is required");
    if (!skills) return alert("Skills are required");  // Check the skills state
    if (!expertise) return alert("Expertise is required");  // Check the expertise state

    // Prepare the payload to send to backend
    const payload = {
      profileDescription: form.profileDescription,
      skills: skills.split(",").map(skill => skill.trim()).filter(Boolean), // Split and trim skills
      expertise: expertise.split(",").map(exp => exp.trim()).filter(Boolean), // Split and trim expertise
      view: form.view,
      createdBy: userId,
    };

    try {
      setLoading(true);

      // Call backend to create portfolio
      const response = await axios.post(
       `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio/create`,  // API endpoint for portfolio creation
        payload,
        
      );

      alert("Portfolio created successfully!");
      window.location.href = "/view"; // Redirect to portfolio page

    } catch (err) {
      console.error(err);
      alert("Error creating portfolioo");
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Your Portfolio</h1>
      {/* Profile Description */}
      <input
        placeholder="Profile Description"
        value={form.profileDescription}
        onChange={(e) => setForm({ ...form, profileDescription: e.target.value })}
      /><br /><br />

      {/* Skills */}
      <input
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}  // Update skills state
      /><br /><br />

      {/* Expertise */}
      <input
        placeholder="Expertise (comma separated)"
        value={expertise}
        onChange={(e) => setExpertise(e.target.value)}  // Update expertise state
      /><br /><br />

      {/* Visibility */}
      <label>Visibility</label><br />
      <select
        value={form.view}
        onChange={(e) => setForm({ ...form, view: e.target.value })}
      >
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>

      <hr />

      {/* Submit Button */}
      <button onClick={handleCreatePortfolio} disabled={true}>
        {loading ? "Creating Portfolio..." : "Create Portfolio (FEATURE NOT PREPARED YET)"}
      </button>
    </div>
  );
}
