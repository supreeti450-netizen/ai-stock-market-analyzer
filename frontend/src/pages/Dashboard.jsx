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

  const [symbol, setSymbol] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzdXByZWV0aUBleGFtcGxlLmNvbSIsImlhdCI6MTc4MDkxMjIwNCwiZXhwIjoxNzgwOTk4NjA0fQ.BxG7xrydT9U8yZuHhoioQyGZ1dSrPMOJ27xZRLrPaQA"; // keep your current token

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

      setAnalysis({
        stock: stockRes.data,
        recommendation:
          recommendationRes.data,
      });

      setChartData(chartRes.data);
    } catch (err) {
      console.log(err);
      alert("Stock not found");
    }
  };

  if (!portfolio || !advisor) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "auto",
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
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "12px",
            width: "250px",
            textAlign: "center",
          }}
        >
          <h3>Portfolio Value</h3>

          <h1>
            $
            {portfolio.totalCurrentValue.toFixed(
              2
            )}
          </h1>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "12px",
            width: "250px",
            textAlign: "center",
          }}
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

      <div
        style={{
          marginTop: "30px",
          border: "1px solid gray",
          padding: "20px",
          borderRadius: "12px",
        }}
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

      {/* AI ADVISOR */}

      <div
        style={{
          marginTop: "30px",
          border: "1px solid gray",
          padding: "20px",
          borderRadius: "12px",
        }}
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

      {/* STOCK ANALYSIS */}

      {analysis && (
        <div
          style={{
            marginTop: "30px",
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
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
    </div>
  );
}

export default Dashboard;