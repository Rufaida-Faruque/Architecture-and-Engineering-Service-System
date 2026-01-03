



import { useEffect, useState } from "react";
import axios from "axios";

export default function ClientDashboard() {
  const [repos, setRepos] = useState([]);
  const [queries, setQueries] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bids, setBids] = useState([]);

  const [loading, setLoading] = useState(true);



  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      try {
        /* ------ LOAD ALL REPOSITORIES ------ */
        const repoRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/repositories`);
        const allRepos = repoRes.data.repos || repoRes.data || [];
        const clientRepos = allRepos.filter((r) =>
          r.clients?.some((c) => (c._id || c).toString() === userId)
        );
        setRepos(clientRepos);

        /* -------------- POSTS -------------- */
        try {
          const p = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/client/${userId}`
          );
          setPosts(p.data || []);
        } catch {
          setPosts([]);
        }

        /* ---------- BIDDING SESSIONS -------- */
        try {
          const b = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/bidSessions/client/${userId}`
          );
          setBids(b.data || []);
        } catch {
          setBids([]);
        }

        /* -------------- QUERIES (last 3) -------------- */
        let qList = [];
        clientRepos.forEach((repo) => {
          const lastThree = repo.queries ? [...repo.queries].slice(-3) : [];

          lastThree.forEach((q) => {
            qList.push({
              repoTitle: repo.title,
              question: q.question,
              answer: q.answer,
            });
          });
        });

        setQueries(qList);

        /* ---------------------------------- */
        /*     LOAD GOOGLE CALENDAR EVENTS     */
        /* ---------------------------------- */
        
      } catch (err) {
        console.error("Dashboard load error:", err);
      }

      setLoading(false);
    }

    loadData();
  }, [userId]);

  if (loading) return <h2>Loading dashboard...</h2>;

  return (
    <div style={{ padding: 25 }}>
      <h1>Client Dashboard</h1>



      {/* --------------- REPOSITORIES --------------- */}
      <section style={section}>
        <h2>📁 Your Repositories</h2>

        {repos.length === 0 && <p>No repositories shared with you.</p>}

        {repos.map((repo) => (
          <div key={repo._id} style={card}>
            <h3>{repo.title}</h3>
            <p>{repo.description}</p>

            <div style={{ marginTop: 10, marginBottom: 10 }}>
              <p>
                <b>To-Do:</b> {repo.checklist?.todo?.length || 0}
              </p>
              <p>
                <b>Ongoing:</b> {repo.checklist?.ongoing?.length || 0}
              </p>
              <p>
                <b>Completed:</b> {repo.checklist?.completed?.length || 0}
              </p>
            </div>

            <button
              style={btn}
              onClick={() =>
                (window.location.href = `/repositories/${repo._id}`)
              }
            >
              Open Repository
            </button>
          </div>
        ))}
      </section>

      {/* -------- POSTS -------- */}
      <section style={section}>
        <h2>📝 Your Posts</h2>

        <button style={btn} onClick={() => (window.location.href = "/posts/new")}>
          Create Post
        </button>

        {posts.length === 0 && <p>No posts available.</p>}

        {posts.map((post) => (
          <div key={post._id} style={card}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <button
              style={btn}
              onClick={() => (window.location.href = `/posts/${post._id}`)}
            >
              View Post
            </button>
          </div>
        ))}
      </section>

      {/* -------- BIDDING SESSIONS -------- */}
      <section style={section}>
        <h2>💰 Bid Sessions</h2>

        <button
          style={btn}
          onClick={() => (window.location.href = "/bidSessions/new")}
        >
          Create Bid Session
        </button>

        {bids.length === 0 && <p>No bid sessions found.</p>}

        {bids.map((bs) => (
          <div key={bs._id} style={card}>
            <h3>{bs.title}</h3>
            <p>
              <b>Budget:</b> {bs.budget}
            </p>

            <button
              style={btn}
              onClick={() =>
                (window.location.href = `/bidSessions/${bs._id}`)
              }
            >
              View Details
            </button>
          </div>
        ))}
      </section>

      {/* -------- QUERIES -------- */}
      <section style={section}>
        <h2>❓ Query Responses</h2>

        {queries.length === 0 && <p>No queries or responses.</p>}

        {queries.map((q, idx) => (
          <div key={idx} style={card}>
            <p>
              <b>Repository:</b> {q.repoTitle}
            </p>
            <p>
              <b>Q:</b> {q.question}
            </p>
            <p>
              <b>A:</b> {q.answer || "(Awaiting response)"}
            </p>
          </div>
        ))}
      </section>

      {/* -------- GOOGLE CALENDAR EVENTS --------
      <section style={section}>
        <h2>📆 Google Calendar Events</h2>

        {calendar.length === 0 && (
          <p>No calendar events or not connected.</p>
        )}

        {calendar.map((ev) => (
          <div key={ev.id} style={card}>
            <h3>{ev.summary}</h3>
            <p>
              {ev.start?.dateTime || ev.start?.date} →{" "}
              {ev.end?.dateTime || ev.end?.date}
            </p>
          </div>
        ))}
      </section> */}
    </div>
  );
}

/* ---------- STYLES ---------- */
const section = {
  background: "#f4f4f4",
  padding: 20,
  borderRadius: 10,
  marginTop: 30,
};

const card = {
  background: "white",
  padding: 15,
  borderRadius: 8,
  marginBottom: 15,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const btn = {
  padding: "8px 14px",
  background: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};



