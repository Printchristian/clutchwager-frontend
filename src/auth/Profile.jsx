import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import Leaderboard from "../Leaderboard";
import MatchForm from "../MatchForm";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const { token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [user, setUser] = useState(null);
  const [picUrl, setPicUrl] = useState("");

  if (!token) return <p>Please log in to view your profile.</p>;

  const { id: userId } = jwtDecode(token);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    async function fetchMatches() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/matches`);
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    }

    fetchUser();
    fetchMatches();
  }, [userId]);

  const userMatches = matches.filter((m) => m.user_id === userId);
  const totalMatches = userMatches.length;
  const totalWins = userMatches.filter((m) => m.did_win).length;
  const totalLosses = userMatches.filter((m) => !m.did_win).length;

  async function updateProfilePic(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/profile-pic`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_pic_url: picUrl })
      });
      const updated = await res.json();
      setUser(updated);
      setPicUrl("");
    } catch (err) {
      console.error("Error updating profile pic:", err);
    }
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
        
        {/* Main section */}
        <div style={{ flex: 1 }}>
          <h2>Your Profile</h2>

          <p>Total Matches Submitted: {totalMatches}</p>
          <p>Total Wins: {totalWins}</p>
          <p>Total Losses: {totalLosses}</p>

          <h3 style={{ marginTop: "20px" }}>Submit a Match</h3>
          <MatchForm />
        </div>

        {/* Sidebar with pic, username, clutchcore */}
        <div style={{ width: "250px", textAlign: "center", border: "1px solid gray", padding: "10px" }}>
          {user.profile_pic_url ? (
            <img
              src={user.profile_pic_url}
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "10px" }}
            />
          ) : (
            <p>No profile picture set yet.</p>
          )}

          <p>Username: {user.username}</p>
          <p>Clutchcore Balance: {user.clutchcore}</p>

          <form onSubmit={updateProfilePic} style={{ marginTop: "10px" }}>
            <input
              placeholder="Image URL"
              value={picUrl}
              onChange={(e) => setPicUrl(e.target.value)}
            />
            <button type="submit">Set Picture</button>
          </form>
        </div>
      </div>

      {/* Floating leaderboard with black/white style */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        border: "2px solid white",
        backgroundColor: "black",
        padding: "10px",
        width: "250px",
        color: "white"
      }}>
        <h3>Leaderboard (Top Players)</h3>
        <Leaderboard />
      </div>
    </div>
  );
}
