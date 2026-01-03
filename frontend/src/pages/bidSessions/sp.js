




import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ServiceProviderDashboard() {
  const [openSessions, setOpenSessions] = useState([]);
  const [participatedSessions, setParticipatedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [spId, setSpId] = useState(null); // Store SP ID
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const spIdFromStorage = localStorage.getItem("userId"); // Get the SP's ID from localStorage
      setSpId(spIdFromStorage); // Set the SP ID
    }
  }, []);

  useEffect(() => {
    if (!spId) return; // Wait until SP ID is available

    async function fetchSessions() {
      try {
        setLoading(true);

        // Fetch open sessions (SP has not participated in these sessions yet)
        const resOpen = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/open`);

        // Fetch participated sessions (SP has placed bids in these sessions)
        const resParticipated = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/sp/${spId}`
        );

        setOpenSessions(resOpen.data);
        setParticipatedSessions(resParticipated.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [spId]);

  const handleSessionClick = (sessionId) => {
    router.push(`/bidSessions/spEdit/${sessionId}`);
  };

  if (loading) return <h2>Loading sessions...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h2>Available Bid Sessions</h2>

      <h3>Open Sessions (Not Yet Participated)</h3>
      <ul>
        {openSessions.length === 0 ? (
          <p>No open bid sessions available.</p>
        ) : (
          openSessions.map((session) => (
            <li key={session._id}>
              <h3>{session.title}</h3>
              <p>{session.description}</p>
              <p>Status: {session.status}</p>
              <button onClick={() => handleSessionClick(session._id)}>
                View Session Details
              </button>
            </li>
          ))
        )}
      </ul>

      <h3>Your Participated Sessions</h3>
      <ul>
        {participatedSessions.length === 0 ? (
          <p>You have not participated in any sessions yet.</p>
        ) : (
          participatedSessions.map((session) => (
            <li key={session._id}>
              <h3>{session.title}</h3>
              <p>{session.description}</p>
              <p>Status: {session.status}</p>
              <button onClick={() => handleSessionClick(session._id)}>
                View Session Details
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
