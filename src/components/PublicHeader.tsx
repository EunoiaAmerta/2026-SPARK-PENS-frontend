import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, LogIn } from "lucide-react";

export default function PublicHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--glass-border)",
      }}
    >
      {isAuthenticated && user ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
            }}
          >
            <User size={18} />
            <span style={{ fontWeight: 500 }}>{user.name}</span>
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
              }}
            >
              ({user.email})
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "1px solid #ef4444",
              color: "#ef4444",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ef4444";
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: "var(--accent)",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 500,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          <LogIn size={16} />
          Login
        </Link>
      )}
    </div>
  );
}
