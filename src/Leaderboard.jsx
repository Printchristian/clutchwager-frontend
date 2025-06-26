import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resMatches = await fetch(`${import.meta.env.VITE_API_URL}/matches`);
        const dataMatches = await resMatches.json();
        setMatches(dataMatches);

        const resUsers = await fetch(`${import.meta.env.VITE_API_URL}/users`);
        const dataUsers = await resUsers.json();
        setUsers(dataUsers);

      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
      }
    }

    fetchData();
  }, []);

  const winCounts = {};
  matches.forEach((match) => {
    if (match.did_win) {
      winCounts[match.user_id] = (winCounts[match.user_id] || 0) + 1;
    }
  });

  const leaderboard = Object.entries(winCounts).sort((a, b) => b[1] - a[1]);

  function getUsernameById(id) {
    const user = users.find((u) => u.id === Number(id));
    return user ? user.username : `User ID: ${id}`;
  }

  return (
    <ol>
      {leaderboard.map(([userId, wins]) => (
        <li key={userId}>
          {getUsernameById(userId)} — Wins: {wins}
        </li>
      ))}
    </ol>
  );
}
