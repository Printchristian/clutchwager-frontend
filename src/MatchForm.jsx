import { useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router";

export default function MatchForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState("");
  const [opponent, setOpponent] = useState("");
  const [didWin, setDidWin] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          game,
          opponent,
          did_win: didWin,
          youtube_url: youtubeUrl,
        }),
      });

      const newMatch = await res.json();
      console.log("Match submitted:", newMatch);

      navigate("/matches");
      setGame("");
      setOpponent("");
      setDidWin(false);
      setYoutubeUrl("");
    } catch (err) {
      console.error("Error submitting match:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit a New Match</h3>

      <input
        placeholder="Game"
        value={game}
        onChange={(e) => setGame(e.target.value)}
      />
      <input
        placeholder="Opponent"
        value={opponent}
        onChange={(e) => setOpponent(e.target.value)}
      />
      <label>
        Did you win?
        <input
          type="checkbox"
          checked={didWin}
          onChange={(e) => setDidWin(e.target.checked)}
        />
      </label>
      <input
        placeholder="YouTube URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />
      <button type="submit">Submit Match</button>
    </form>
  );
}
