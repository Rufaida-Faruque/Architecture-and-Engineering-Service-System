




import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { CohereClient } from 'cohere-ai';

// Initialize Cohere client with API key (ensure the key is stored securely)
const API_KEY = process.env.NEXT_PUBLIC_COHERE_API_KEY;  // Make sure to store your API key in environment variables
const cohere = new CohereClient({ token: API_KEY });

export default function ClientEditSession() {
  const router = useRouter();
  const { sessionId } = router.query;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWinner, setSelectedWinner] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null); // To hold remaining time for countdown
  const [winnerEmail, setWinnerEmail] = useState(""); // Store winner's email
  const [recommendation, setRecommendation] = useState(""); // Store generated recommendation text

  // Fetch session data when the page is loaded
  useEffect(() => {
    if (!sessionId) return;

    async function fetchSessionDetails() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/${sessionId}`);
        setSession(res.data);
      } catch (err) {
        setError("Failed to load session details.");
      } finally {
        setLoading(false);
      }
    }
    fetchSessionDetails();
  }, [sessionId]);

  // Countdown logic for the timer
  useEffect(() => {
    if (session && session.hasTimer && session.status === "open" && session.duration) {
      const timerEndTime = new Date(session.createdAt).getTime() + session.duration * 60 * 60 * 1000;

      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const timeLeft = timerEndTime - currentTime;

        if (timeLeft <= 0) {
          setTimeRemaining(0);
          clearInterval(interval);
          handleCloseSession();
          alert("The session has automatically closed!");
        } else {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, [session]);

  useEffect(() => {
    if (session && session.winner) {
      async function fetchWinnerEmail() {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/find-by-id?userId=${session.winner}`);
          const data = await response.json();
          setWinnerEmail(data.email); // Store the winner's email
        } catch (err) {
          setError("Failed to fetch winner's email.");
        }
      }
      fetchWinnerEmail();
    }
  }, [session]);

  // Close session
  const handleCloseSession = async () => {
    if (session.status !== "open") {
      alert("You can only close an open session.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/${sessionId}/close`,
        { clientId: localStorage.getItem("userId") } // Pass clientId from localStorage
      );
      setSession((prevSession) => ({ ...prevSession, status: "closed" })); // Update local state
      alert("Session closed successfully");
    } catch (err) {
      setError("Failed to close the session");
      console.error(err);  // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };













  // Function to generate recommendation based on bids using Cohere API
const generateRecommendation = async () => {
  if (session.status !== "closed" || session.bids.length === 0) {
    setRecommendation("No bids available or session is not closed yet.");
    return;
  }

  // Construct the payload with session and bid details
  const payload = {
    session: {
      title: session.title,
      description: session.description,
      amount: session.amount,
      bids: session.bids.map(bid => ({
        sp: {
          _id: bid.sp._id,
          email: bid.sp.email
        },
        amount: bid.amount,
        statement: bid.statement
      }))
    }
  };

  // Stringify the payload object to pass it as a string
  const stringifiedPayload = JSON.stringify(payload, null, 2); // Pretty print with 2 spaces

  // Prepare the text prompt to send to Cohere API
  const prompt = `Based on the bids and repository numbers, recommend the best SP(Considering the amount given 
  by the client is their budget and the amound bid by the SP are what they are asking for to complete the task. The client can
  go over the budget a little bit. So give one recommendation on best value and another based on lowest) and explain in short
  from the following offers:
    ${stringifiedPayload}`;

  try {
    // Call Cohere API to generate the recommendation
    const response = await fetchCohereRecommendation(prompt);
    setRecommendation(response);  // Set recommendation in the state
  } catch (error) {
    // Handle error if the API call fails
    console.error('Error with Cohere API:', error);
    setRecommendation("Error generating recommendation.");
  }
};














  // Function to interact with Cohere API
  const fetchCohereRecommendation = async (prompt) => {
    try {
      const result = await cohere.chat({
        message: prompt,
        model: 'command-r-08-2024', // Cohere's model
      });
      return result.text;  // Return the generated recommendation text
    } catch (error) {
      console.error('Error calling Cohere API:', error);
      throw new Error("Failed to generate recommendation with Cohere");
    }
  };

  // Delete session
  const handleDeleteSession = async () => {
    if (session.status === "closed") {
      alert("You cannot delete a closed session.");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/${sessionId}`,
        {
          data: { clientId: localStorage.getItem("userId") } // Pass clientId in the request body
        }
      );

      alert("Session deleted successfully");
      router.push("/bidSessions"); // Redirect back to the sessions list
    } catch (err) {
      setError("Failed to delete the session");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWinner = async (winnerId) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/${sessionId}/select-winner`,
        { winnerId }
      );

      const winnerEmail = response.data.session.winner.email; // Get the winner's email from the response

      setSelectedWinner(winnerId);
      alert(`Winner selected successfully! Winner: ${winnerEmail}`);
      window.location.reload();
    } catch (err) {
      setError("Failed to select a winner");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading session details...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h2>{session.title}</h2>
      <p>{session.description}</p>
      <p>Status: {session.status}</p>
      <p><strong>Starting Amount: </strong>{session.amount}</p>

      {/* Show timer countdown */}
      {session.hasTimer && session.status === "open" && (
        <p><strong>Time Remaining: </strong>{timeRemaining || "Calculating..."}</p>
      )}

      {/* Show bid details */}
      <h3>Bids:</h3>
      <table>
        <thead>
          <tr>
            <th>SP</th>
            <th>Amount</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {session.bids.map((bid) => (
            <tr key={bid._id}>
              <td>{bid.sp.email}</td>
              <td>{bid.amount}</td>
              <td>{bid.statement}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Get Recommendation Button */}
      {session.status === "closed" && !session.winner && session.bids.length > 0 && (
        <button onClick={generateRecommendation}>Get Recommendation</button>
      )}

      {/* Show Recommendation */}
      {recommendation && (
        <div>
          <h3>Recommendation:</h3>
          <p>{recommendation}</p>
        </div>
      )}

      {/* Close Session Button */}
      {session.status === "open" && (
        <button onClick={handleCloseSession}>Close Session</button>
      )}

      {/* Select Winner Section (visible if the session is closed) */}
      {session.status === "closed" && !session.winner && (
        <div>
          <h3>Select a Winner</h3>
          <select onChange={(e) => handleSelectWinner(e.target.value)} value={selectedWinner}>
            <option value="">Select a winner</option>
            {session.bids.map((bid) => (
              <option key={bid._id} value={bid.sp._id}>
                {bid.sp.email} - {bid.amount}
              </option>
            ))}
          </select>
        </div>
      )}
      {session.winner && (
        <p>Winner: {winnerEmail}</p> // Display the selected winner
      )}

      {/* Delete Session Button (only for open sessions) */}
      {session.status === "open" && (
        <button onClick={handleDeleteSession}>Delete Session</button>
      )}
    </div>
  );
}
