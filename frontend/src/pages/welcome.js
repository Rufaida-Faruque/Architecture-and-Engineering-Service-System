



import { useEffect, useState } from "react";

export default function WelcomePage() {
  const [role, setRole] = useState(null);
  const [hasPortfolio, setHasPortfolio] = useState(null); // New state to track if SP has portfolio

  useEffect(() => {
    let r = localStorage.getItem("role");

    if (r === "cl") r = "client";
    if (r === "sp") r = "serviceProvider";
    if (r === "adm") r = "admin";

    setRole(r);
    if (r === "serviceProvider") {
      // Check if the SP has a portfolio
      checkIfSPHasPortfolio();
    }
  }, []);

  const checkIfSPHasPortfolio = async () => {
    try {
      const response = await fetch("/api/sp/portfolio", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHasPortfolio(data.hasPortfolio); // Set the state based on the response
      } else {
        setHasPortfolio(false); // If the response is not ok, assume no portfolio
      }
    } catch (error) {
      console.error("Error fetching portfolio status", error);
      setHasPortfolio(false); // Assume no portfolio in case of an error
    }
  };



  if (!role) return <p>Loading...</p>;

  const goToDashboard = () => {
    if (role === "client") window.location.href = "/dashboard/client";
    if (role === "serviceProvider") window.location.href = "/dashboard/sp";
    if (role === "admin") window.location.href = "/dashboard/admin";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome!</h1>
      <p>Select what you want to do:</p>

      {/* ⭐ NEW: Dashboard button for all roles */}
      <button onClick={goToDashboard} style={{ marginBottom: "20px" }}>
        View Dashboard
      </button>

      {/* CLIENT */}
      {role === "client" && (
        <div>
          <button onClick={() => (window.location.href = "/repositories")}>
            View Repositories
          </button>

          <button onClick={() => (window.location.href = "/posts")}>
            View Posts
          </button>

          <button onClick={() => (window.location.href = "/posts/new")}>
            Create Post
          </button>

          <button onClick={() => (window.location.href = "/bidSessions")}>
            View Bid Sessions
          </button>

          <button onClick={() => (window.location.href = "/bidSessions/new")}>
            Create Bid Session
          </button>
        </div>
      )}

      {/* SERVICE PROVIDER
      {role === "serviceProvider" && (
        <div>
          <button onClick={() => (window.location.href = "/repositories")}>
            View Repositories
          </button>

          <button onClick={() => (window.location.href = "/repositories/new")}>
            Create Repository
          </button>

          <button onClick={() => (window.location.href = "/bidSessions")}>
            View Bid Sessions
          </button>
        </div>
      )} */}

            {/* SERVICE PROVIDER */}
      {role === "serviceProvider" && (
        <div>
          <button onClick={() => (window.location.href = "/repositories")}>
            View Repositories
          </button>

          <button onClick={() => (window.location.href = "/repositories/new")}>
            Create Repository
          </button>

          <button onClick={() => (window.location.href = "/bidSessions")}>
            View Bid Sessions
          </button>

          {/* Conditional rendering for Create/ View Portfolio */}
          {hasPortfolio === null ? (
            <p>Loading portfolio status...</p>
          ) : hasPortfolio ? (
            <button onClick={() => (window.location.href = "/sp/portfolio")}>
              View Portfolio
            </button>
          ) : (
            <button onClick={() => (window.location.href = "/sp/create")}>
              Create Portfolio
            </button>
          )}
        </div>
      )}

      {/* ADMIN */}
      {/* {role === "admin" && (
        <div>
          <button onClick={() => (window.location.href = "/admin/verification")}>
            Verification Requests
          </button>

          <button onClick={() => (window.location.href = "/admin/reports")}>
            Reports
          </button>

          <button onClick={() => (window.location.href = "/admin/repositories")}>
            Repository Approvals
          </button>
        </div>
      )} */}
    </div>
  );
}



