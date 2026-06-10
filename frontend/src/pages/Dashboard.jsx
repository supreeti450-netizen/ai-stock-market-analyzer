import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import API from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [advisor, setAdvisor] = useState(null);
  const [news, setNews] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [targetPrice, setTargetPrice] = useState("");
  const [conditionType, setConditionType] =
  useState("ABOVE");
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzdXByZWV0aUBleGFtcGxlLmNvbSIsImlhdCI6MTc4MTA3NjEyNiwiZXhwIjoxNzgxMTYyNTI2fQ.NyQLBRzrRRNIVnr1dR12lfp6df2u3D9ig6Iv5sGhdSY";
      const valueRes = await API.get(
        "/portfolio/value",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const advisorRes = await API.get(
        "/portfolio/advisor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPortfolio(valueRes.data);
      setAdvisor(advisorRes.data);
      const watchlistRes =
         await API.get("/watchlist/live", {
         headers: {
         Authorization: `Bearer ${token}`,
         },
        });
        setWatchlist(watchlistRes.data);
        const alertsRes =
            await API.get("/alerts", {
             headers: {
                 Authorization: `Bearer ${token}`,
               },
        });

setAlerts(alertsRes.data);  
    } catch (err) {
      console.log(err);

      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
      }
    }
  };
  
  const analyzeStock = async () => {
    try {
      if (!symbol) {
        alert("Enter stock symbol");
        return;
      }

      const upperSymbol =
        symbol.toUpperCase();

      const stockRes = await API.get(
        `/stock/${upperSymbol}`
      );

      const recommendationRes =
        await API.get(
          `/stock/recommendation/${upperSymbol}`
        );

      const chartRes =
        await API.get(
          `/chart/${upperSymbol}`
        );
      const newsRes = await API.get(`/news/${upperSymbol}`);
      setAnalysis({
        stock: stockRes.data,
        recommendation:
          recommendationRes.data,
      });

      setChartData(chartRes.data);
      setNews(newsRes.data);
    } catch (err) {
      console.log(err);
      alert("Stock not found");
    }
  };
  const createAlert = async () => {
  try {
    const token =
      "YOUR_CURRENT_JWT_TOKEN";

    await API.post(
      "/alerts",
      {
        stock_symbol: symbol.toUpperCase(),
        target_price: targetPrice,
        condition_type: conditionType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Alert Created!");

    loadData();
  } catch (err) {
    console.log(err);
    alert("Failed to create alert");
  }
};
  if (!portfolio || !advisor) {
    return <h2>Loading...</h2>;
  }

   return (
  <>
    <Sidebar />

   <div
  style={{
    marginLeft: "250px",
    padding: "30px",
    maxWidth: "1200px",
  }}
>
      <Navbar />
    <div
      style={{
        padding: "30px",
        width: "100%",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        AI Stock Analyzer Dashboard
      </h1>

      {/* STOCK ANALYZER */}

      <div
        style={{
          border: "1px solid gray",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Stock Analyzer
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Stock Symbol (AAPL)"
            value={symbol}
            onChange={(e) =>
              setSymbol(e.target.value)
            }
            style={{
              padding: "10px",
              width: "300px",
            }}
          />

          <button
            onClick={analyzeStock}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Analyze
          </button>
        </div>
      </div>

      {/* PORTFOLIO */}

      <div
 style={{
   display: "grid",
   gridTemplateColumns: "1fr 1fr",
   gap: "20px",
   marginTop: "20px",
 }}
>
        <div className="card"
        >
          <h3>Portfolio Value</h3>

          <h1>
            $
            {portfolio.totalCurrentValue.toFixed(
              2
            )}
          </h1>
        </div>

        <div className= "card"
        >
          <h3>Profit / Loss</h3>

          <h1>
            $
            {portfolio.totalProfitLoss.toFixed(
              2
            )}
          </h1>
        </div>
      </div>

      {/* HOLDINGS */}

      <div className ="card"
      >
        <h2 style={{ textAlign: "center" }}>
          My Holdings
        </h2>

        {portfolio.holdings.map(
          (stock, index) => (
            <p
              key={index}
              style={{
                textAlign: "center",
              }}
            >
              {stock.symbol} -{" "}
              {stock.quantity} Shares
            </p>
          )
        )}
      </div>
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  }}
>
      {/* AI ADVISOR */}

      <div className="card"
      >
        <h2 style={{ textAlign: "center" }}>
          AI Advisor
        </h2>

        <p>
          <strong>
            Portfolio Score:
          </strong>{" "}
          {advisor.portfolioScore}
        </p>

        <p>
          <strong>Risk Level:</strong>{" "}
          {advisor.riskLevel}
        </p>

        <h3>Recommendations</h3>

        <ul>
          {advisor.recommendations.map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div> 
      {/* WATCHLIST */}

<div className = "card"
>
  <h2 style={{ textAlign: "center" }}>
    Live Watchlist
  </h2>

  {watchlist.map((stock, index) => (
    <div
      key={index}
      style={{
        borderBottom: "1px solid gray",
        marginBottom: "15px",
        paddingBottom: "10px",
      }}
    >
      <p>
        <strong>Symbol:</strong>{" "}
        {stock.symbol}
      </p>

      <p>
        <strong>Price:</strong> $
        {stock.price}
      </p>

      <p>
        <strong>Exchange:</strong>{" "}
        {stock.exchange}
      </p>
    </div>
  ))}
</div>
</div>

      {/* PRICE ALERTS */}

<div className = "card"
>
  <h2 style={{ textAlign: "center" }}>
    Price Alerts
  </h2>

  {alerts.length === 0 ? (
    <p>No alerts created</p>
  ) : (
    alerts.map((alert) => (
      <div
        key={alert.id}
        style={{
          borderBottom: "1px solid gray",
          marginBottom: "10px",
          paddingBottom: "10px",
        }}
      >
        <p>
          <strong>Stock:</strong>{" "}
          {alert.stock_symbol}
        </p>

        <p>
          <strong>Condition:</strong>{" "}
          {alert.condition_type}
        </p>

        <p>
          <strong>Target:</strong> $
          {alert.target_price}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {alert.is_triggered
            ? "Triggered"
            : "Active"}
        </p>
      </div>
    ))
  )}
</div>
      {/* STOCK ANALYSIS */}

      {analysis && (
        <div className="card"
        >
        <select
  value={conditionType}
  onChange={(e) =>
    setConditionType(e.target.value)
  }
  style={{
    padding: "10px",
  }}
>
  <option value="ABOVE">
    Above
  </option>

  <option value="BELOW">
    Below
  </option>
</select>

<input
  type="number"
  placeholder="Target Price"
  value={targetPrice}
  onChange={(e) =>
    setTargetPrice(e.target.value)
  }
  style={{
    padding: "10px",
    width: "150px",
  }}
/>

<button
  onClick={createAlert}
  style={{
    padding: "10px 20px",
    cursor: "pointer",
  }}
>
  Create Alert
</button>    
          <h2 style={{ textAlign: "center" }}>
            Stock Analysis
          </h2>

          <p>
            <strong>Symbol:</strong>{" "}
            {analysis.stock.symbol}
          </p>

          <p>
            <strong>
              Current Price:
            </strong>{" "}
            ${analysis.stock.price}
          </p>

          <p>
            <strong>Exchange:</strong>{" "}
            {analysis.stock.exchange}
          </p>

          <hr />

          <p>
            <strong>
              Recommendation:
            </strong>{" "}
            {
              analysis.recommendation
                .recommendation
            }
          </p>

          <p>
            <strong>
              Confidence:
            </strong>{" "}
            {
              analysis.recommendation
                .confidence
            }
            %
          </p>

          <p>
            <strong>Reason:</strong>{" "}
            {
              analysis.recommendation
                .reason
            }
          </p>
        </div>
      )}

      {/* CHART */}

      {chartData.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
            }}
          >
            Price Trend (1 Month)
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={chartData}>
              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#00ff99"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
            {/* NEWS SENTIMENT */}

      {news.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            AI News Sentiment
          </h2>

          {news.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "1px solid gray",
              }}
            >
              <h4>{item.title}</h4>

              <p>
                <strong>Source:</strong>{" "}
                {item.source}
              </p>

              <p>
                <strong>Sentiment:</strong>{" "}
                {item.sentiment}
              </p>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                Read Article
              </a>
            </div>
          ))}
        </div>
      )}
      {/* PRICE ALERTS */}

{alerts.length > 0 && (
  <div
    style={{
      marginTop: "30px",
      border: "1px solid gray",
      padding: "20px",
      borderRadius: "12px",
    }}
  >
    <h2
      style={{
        textAlign: "center",
      }}
    >
      Price Alerts
    </h2>

    {alerts.map((alert) => (
      <div
        key={alert.id}
        style={{
          marginBottom: "15px",
        }}
      >
        <strong>
          {alert.stock_symbol}
        </strong>

        {" - "}

        {alert.condition_type}

        {" "}

        ${alert.target_price}

        {" | "}

        Status:

        {" "}

        {alert.is_triggered
          ? "Triggered"
          : "Waiting"}
      </div>
    ))}
  </div>
)}
    </div>
    </div>
   </> 
  );
}

export default Dashboard;