import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header id="navbar">
      <NavLink id="brand" to="/">
        <h1>ClutchWager</h1>
      </NavLink>

      <nav>
        {token ? (
          <>
            <NavLink to="/profile">Profile</NavLink>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </nav>
    </header>
  );
}
