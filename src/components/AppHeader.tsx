import { useNavigate } from "react-router-dom";
import { BrandMark } from "./BrandMark";
import { useAuth } from "../context/AuthContext";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="app-header">
      <div className="container app-header-inner">
        <div className="app-header-brand">
          <BrandMark size={30} />
          <span>EinfachPatho</span>
        </div>
        <div className="app-header-user">
          {user && <span className="app-header-username">{user.username}</span>}
          <button className="btn btn-ghost" onClick={handleLogout}>
            Abmelden
          </button>
        </div>
      </div>
    </header>
  );
}
