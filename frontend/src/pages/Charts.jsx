function Charts() {
  const stocks = [
    { symbol: "AAPL", price: 291 },
    { symbol: "MSFT", price: 402 },
    { symbol: "NVDA", price: 201 },
    { symbol: "TSLA", price: 391 },
  ];

  return (
    <div
      style={{
        padding: "40px",
        marginLeft: "250px",
        color: "white",
      }}
    >
      <h1>📈 Stock Charts</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        {stocks.map((stock, index) => (
          <div key={index} className="card">
            <h2>{stock.symbol}</h2>
            <h3>${stock.price}</h3>

            <div
              style={{
                height: "120px",
                background:
                  "linear-gradient(45deg,#2563eb,#60a5fa)",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Charts;