import { useState, useEffect } from "react";
import axios from "axios";

export default function ViewPortfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    // Fetch portfolio and repositories
    const fetchPortfolioAndRepositories = async () => {
      try {
        // Fetch portfolio
        const portfolioResponse = await axios.get("/api/portfolio", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setPortfolio(portfolioResponse.data);

        // Fetch repositories
        const repositoriesResponse = await axios.get("/api/repositories", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setRepositories(repositoriesResponse.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching portfolio or repositories");
      }
    };

    fetchPortfolioAndRepositories();
  }, []);

  return (
    <div>
      <h2>Your Portfolio</h2>
      {portfolio ? (
        <>
          <p><strong>Description:</strong> {portfolio.profileDescription}</p>
          <p><strong>Skills:</strong> {portfolio.skills.join(", ")}</p>
          <p><strong>Expertise:</strong> {portfolio.expertise.join(", ")}</p>
        </>
      ) : (
        <p>Loading portfolio...</p>
      )}

      <hr />

      <h3>Your Repositories</h3>
      <ul>
        {repositories.map(repo => (
          <li key={repo._id}>{repo.title} - {repo.description}</li>
        ))}
      </ul>
    </div>
  );
}
