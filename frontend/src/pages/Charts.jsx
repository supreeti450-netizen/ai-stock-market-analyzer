import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Charts() {
  const data = [
    { day: "Mon", price: 180 },
    { day: "Tue", price: 190 },
    { day: "Wed", price: 185 },
    { day: "Thu", price: 210 },
    { day: "Fri", price: 201 },
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

      <div className="card">
        <h2>NVDA</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;