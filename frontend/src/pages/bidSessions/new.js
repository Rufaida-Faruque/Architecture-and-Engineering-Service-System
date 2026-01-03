



import { useState, useEffect } from "react";
import axios from "axios";

export default function NewBidSession() {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "", // Amount for the session
    allowVisibility: true, // Default visibility to true
    hasTimer: false, // Whether the session has a timer
    duration: "", // Duration of the session in hours/days
  });

  const [loading, setLoading] = useState(false);

  // Fetch userId and role from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
      setRole(localStorage.getItem("role"));
    }
  }, []);

  // Handle form data changes
  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  function handleTimerToggle(event) {
    setForm((prevForm) => ({
      ...prevForm,
      hasTimer: event.target.checked,
    }));
  }

  // Handle visibility toggle
  function handleVisibilityToggle(event) {
    setForm((prevForm) => ({
      ...prevForm,
      allowVisibility: event.target.checked,
    }));
  }

  // Handle form submission
  async function handleCreateBidSession() {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!form.amount) {
      alert("Amount is required to start the session");
      return;
    }

    if (!userId) {
      alert("User not logged in");
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      amount: form.amount, // Pass the amount for the session
      allowBidVisibility: form.allowVisibility, // Pass visibility setting
      clientId: userId,
      hasTimer: form.hasTimer,
      duration: form.hasTimer ? form.duration : null, // If there's a timer, include the duration
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/create`, payload);

      alert("Bid session created successfully!");
      window.location.href = "/bidSessions/client"; // Redirect after creation

    } catch (err) {
      console.error("Error creating bid session:", err);
      alert(err.response?.data?.message || "Failed to create bid session");
    } finally {
      setLoading(false);
    }
  }

  if (!userId) return <h2>Loading...</h2>;
  if (role !== "cl") return <h2>Unauthorized — Clients only</h2>;

  return (
    <div style={{ padding: 30, maxWidth: 600 }}>
      <h1>Create Bid Session</h1>

      {/* Title Field */}
      <input
        name="title"
        placeholder="Bid Session Title"
        value={form.title}
        onChange={handleInputChange}
        style={{ width: "100%", padding: 8 }}
      />
      <br /><br />

      {/* Description Field */}
      <textarea
        name="description"
        placeholder="Bid Session Description"
        value={form.description}
        onChange={handleInputChange}
        style={{ width: "100%", padding: 8, minHeight: 80 }}
      />
      <br /><br />

      {/* Amount Field */}
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleInputChange}
        style={{ width: "100%", padding: 8 }}
      />
      <br /><br />

      {/* Timer Option */}
      <label>
        <input
          type="checkbox"
          name="hasTimer"
          checked={form.hasTimer}
          onChange={handleTimerToggle}
        />{" "}
        Set a timer for the session
      </label>
      <br />

      {/* Timer Duration */}
      {form.hasTimer && (
        <input
          name="duration"
          type="number"
          placeholder="Duration in hours"
          value={form.duration}
          onChange={handleInputChange}
          style={{ width: "100%", padding: 8 }}
        />
      )}

      <hr />

      {/* Visibility Option */}
      <label>
        <input
          type="checkbox"
          name="allowVisibility"
          checked={form.allowVisibility}
          onChange={handleVisibilityToggle}
        />{" "}
        Allow Service Providers to see other bids
      </label>

      <hr />

      {/* Submit Button */}
      <button onClick={handleCreateBidSession} disabled={loading}>
        {loading ? "Creating..." : "Create Bid Session"}
      </button>
    </div>
  );
}
