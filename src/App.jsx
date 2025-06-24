import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import MatchList from "./MatchList";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MatchList />} />
        <Route path="/matches" element={<MatchList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
