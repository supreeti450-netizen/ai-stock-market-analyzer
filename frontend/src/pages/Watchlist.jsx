import { useEffect, useState } from "react";
import API from "../services/api";

function Watchlist() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
  try {
    const res = await API.get("/watchlist/live");

    console.log("WATCHLIST DATA:", res.data);

    setStocks(res.data);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        ⭐ My Watchlist
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="card"
          >
            <h2>{stock.symbol}</h2>

            <p>
              Price:
              <strong>
                {" "}
                ${stock.price}
              </strong>
            </p>

            <p>
              Exchange:
              <strong>
                {" "}
                {stock.exchange}
              </strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;