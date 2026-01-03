

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ClientBidSessions() {
  const router = useRouter();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all the sessions created by the client
    async function fetchSessions() {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/client/${userId}`);
        setSessions(res.data);
      } catch (err) {
        setError("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  if (loading) return <h2>Loading your sessions...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h1>Your Created Bid Sessions</h1>
      {sessions.length === 0 ? (
        <p>You haven't created any bid sessions yet.</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session._id}>
              <h3>{session.title}</h3>
              <p>{session.description}</p>
              <p>Status: {session.status}</p>
              <button onClick={() => router.push(`/bidSessions/clientEdit/${session._id}`)}>
                View/Edit Session
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
