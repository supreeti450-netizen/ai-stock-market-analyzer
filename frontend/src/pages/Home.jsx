import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "72px",
          marginBottom: "20px",
          color: "#60a5fa",
        }}
      >
        📈 AI Stock Market Analyzer
      </h1>
      <div>
  <h3>📈 Charts</h3>
  <p>View stock performance charts.</p>
</div>
      <p
        style={{
          fontSize: "22px",
          maxWidth: "800px",
          marginBottom: "40px",
        }}
      >
        Analyze stocks, manage watchlists,
        track portfolios and get AI-powered
        investment recommendations.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/dashboard">
          <button
            style={{
              padding: "15px 30px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Open Dashboard
          </button>
        </Link>

        <Link to="/ai">
          <button
            style={{
              padding: "15px 30px",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            Try AI Assistant
          </button>
        </Link>
      </div>

      <div
        style={{
          marginTop: "80px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <div className="card">
          <h2>📊 Portfolio Tracking</h2>
          <p>
            Monitor investments and
            performance in real time.
          </p>
        </div>

        <div className="card">
          <h2>⭐ Watchlist</h2>
          <p>
            Track your favorite stocks.
          </p>
        </div>

        <div className="card">
          <h2>🤖 AI Recommendations</h2>
          <p>
            Get intelligent investment
            suggestions.
          </p>
        </div>

        <div className="card">
          <h2>🚨 Price Alerts</h2>
          <p>
            Receive alerts when stock prices
            reach target values.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;