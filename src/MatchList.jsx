import { useEffect, useState } from "react";

export default function MatchList() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch("http://localhost:3000/matches");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    }

    fetchMatches();
  }, []);

  return (
    <div>
      <h2>Match Feed</h2>
      {matches.map((match) => (
        <div key={match.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p>Game: {match.game}</p>
          <p>Opponent: {match.opponent}</p>
          <p>Win?: {match.did_win ? "Yes" : "No"}</p>
          <p>
            Video:{" "}
            <a href={match.youtube_url} target="_blank" rel="noopener noreferrer">
              Watch
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}
