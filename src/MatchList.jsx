import { useEffect, useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function MatchList() {
  const { token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Safely decode userId only if token exists
  let userId;
  if (token) {
    const { id } = jwtDecode(token);
    userId = id;
  }

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/matches`);
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    }

    fetchMatches();
  }, []);

  async function handleDelete(id) {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/matches/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setMatches(matches.filter((match) => match.id !== id));
    } catch (err) {
      console.error("Error deleting match:", err);
    }
  }

  function updateMatchField(id, field, value) {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === id ? { ...match, [field]: value } : match
      )
    );
  }

  async function saveMatch(id) {
    const match = matches.find((m) => m.id === id);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/matches/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          game: match.game,
          opponent: match.opponent,
          did_win: match.did_win,
          youtube_url: match.youtube_url
        })
      });
      setEditingId(null);
    } catch (err) {
      console.error("Error updating match:", err);
    }
  }

  return (
    <div>
      <h2>Match Feed</h2>
      {matches.map((match) => (
        <div key={match.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          {editingId === match.id ? (
            <div>
              <input
                placeholder="Game"
                value={match.game}
                onChange={(e) => updateMatchField(match.id, "game", e.target.value)}
              />
              <input
                placeholder="Opponent"
                value={match.opponent}
                onChange={(e) => updateMatchField(match.id, "opponent", e.target.value)}
              />
              <label>
                Did you win?
                <input
                  type="checkbox"
                  checked={match.did_win}
                  onChange={(e) => updateMatchField(match.id, "did_win", e.target.checked)}
                />
              </label>
              <input
                placeholder="YouTube URL"
                value={match.youtube_url}
                onChange={(e) => updateMatchField(match.id, "youtube_url", e.target.value)}
              />
              <button onClick={() => saveMatch(match.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <p>Game: {match.game}</p>
              <p>Opponent: {match.opponent}</p>
              <p>Win?: {match.did_win ? "Yes" : "No"}</p>
              <p>
                Video:{" "}
                <a href={match.youtube_url} target="_blank" rel="noopener noreferrer">
                  Watch
                </a>
              </p>

              {match.user_id === userId && (
                <>
                  <button onClick={() => handleDelete(match.id)}>Delete</button>
                  <button onClick={() => setEditingId(match.id)}>Edit</button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
