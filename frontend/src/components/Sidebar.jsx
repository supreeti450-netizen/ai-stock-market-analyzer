import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        📈 AI Stock
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/watchlist"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          ⭐ Watchlist
        </Link>

        <Link
          to="/ai"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          🤖 AI Assistant
        </Link>

        <Link
          to="/login"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          🔐 Login
        </Link>

        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          🏠 Home
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;