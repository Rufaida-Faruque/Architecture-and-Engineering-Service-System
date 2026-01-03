






import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ServiceProviderEditSession() {
  const router = useRouter();
  const { sessionId } = router.query;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [bidComment, setBidComment] = useState("");
  const [myBid, setMyBid] = useState(null); // SP's own bid
  const [visibility, setVisibility] = useState(false); // Tracks visibility of bids
  const [message, setMessage] = useState(""); // Message for winner status
  const [timer, setTimer] = useState(null); // To track remaining time for the countdown

  useEffect(() => {
    if (!sessionId) return;

    async function fetchSessionDetails() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/${sessionId}`);
        setSession(res.data);
        setVisibility(res.data.allowBidVisibility); // Set visibility setting
        const myBid = res.data.bids.find((bid) => bid.sp._id === localStorage.getItem("userId"));
        setMyBid(myBid); // Set SP's own bid if it exists

        // Set the winner status message only if the session is closed
        if (res.data.status === "closed") {
          const spId = localStorage.getItem("userId");

          if (res.data.winner) {
            // Check if the current SP is the winner
            if (res.data.winner.toString() === spId) {
              setMessage("Congratulations! You are the winner");
            } else {
              setMessage("Sorry, you are not the winner");
            }
          } else {
            setMessage("Winner selection has not been done");
          }
        }

        // If timer is set, calculate the countdown
        if (res.data.hasTimer && res.data.status === "open") {
          const endTime = new Date(res.data.createdAt).getTime() + res.data.duration * 60 * 60 * 1000;
          const interval = setInterval(() => {
            const remainingTime = endTime - Date.now();
            if (remainingTime <= 0) {
              clearInterval(interval);
              setTimer("Session has ended");
              
              closeSessionAutomatically();
            } else {
              const hours = Math.floor(remainingTime / (1000 * 60 * 60));
              const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
              setTimer(`${hours}:${minutes}:${seconds}`);
            }
          }, 1000);
        }

      } catch (err) {
        setError("Failed to load session details.");
      } finally {
        setLoading(false);
      }
    }

    fetchSessionDetails();
  }, [sessionId]);

const closeSessionAutomatically = async () => {
  try {
    setLoading(true);
    
    // Trigger the new timeroff route to close the session once the timer ends
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/${sessionId}/timeroff`);
    
    // Update local session state to reflect the closed status
    // setSession((prevSession) => ({ ...prevSession, status: "closed" }));
    
    alert("Session closed automatically due to timer.");
    window.location.reload();
  } catch (err) {
    setError("Failed to close the session");
    console.error(err);  // Log the error for better debugging
  } finally {
    setLoading(false);
  }
};

  // Place bid logic
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    // Ensure both amount and comment are entered
    if (!bidAmount || !bidComment) {
      alert("Please enter both amount and comment.");
      return;
    }

    try {
      setLoading(true);
      const spId = localStorage.getItem("userId"); // Get the SP's ID from localStorage (make sure it's set correctly)

      if (!spId) {
        alert("Service provider ID is missing.");
        return;
      }

      // Send POST request to backend with the necessary data
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/${sessionId}/bid`, {
        amount: bidAmount,
        statement: bidComment,
        spId: spId,
      });

      alert("Bid placed successfully!");
      setBidAmount(""); // Clear input fields
      setBidComment(""); // Clear comment field
      window.location.reload();
    } catch (err) {
      console.error("Failed to place bid:", err);
      alert("Failed to place the bid.");
    } finally {
      setLoading(false);
    }
  };

  // Delete bid logic
  const handleDeleteBid = async () => {
    if (!myBid) return;

    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/${sessionId}/bid/${myBid._id}`);
      setMyBid(null); // Remove bid from local state
      alert("Bid deleted successfully");
    } catch (err) {
      setError("Failed to delete the bid.");
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
      <p><strong>Client: </strong>{session.client.email}</p>

      {/* Timer Countdown */}
      {session.hasTimer && session.status === "open" && (
        <div>
          <h3>Time remaining: {timer}</h3>
        </div>
      )}

      {/* Display winner status message only if the session is closed */}
      {session.status === "closed" && (
        <div>
          <h3>Winner Status:</h3>
          <p>{message}</p>
        </div>
      )}

      {/* Show bid details */}
      <h3>Bids</h3>
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

      {/* Place Bid Form */}
      {session.status === "open" && !myBid && (
        <form onSubmit={handlePlaceBid}>
          <div>
            <label>Bid Amount</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Comment</label>
            <textarea
              value={bidComment}
              onChange={(e) => setBidComment(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Placing Bid..." : "Place Bid"}
          </button>
        </form>
      )}

      {/* SP's Existing Bid */}
      {myBid && (
        <div>
          <h4>Your Bid</h4>
          <p>Amount: {myBid.amount}</p>
          <p>Comment: {myBid.statement}</p>
          <button onClick={handleDeleteBid} disabled={session.status === "closed"}>
            Withdraw Your Bid
          </button>
        </div>
      )}
    </div>
  );
}
