const cors = require("cors");
const watchlistRoutes = require("./routes/watchlistRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const pool = require("./db");
const stockRoutes = require("./routes/stockRoutes");
const alertRoutes =
    require("./routes/alertRoutes");
const portfolioRoutes =
require("./routes/portfolioRoutes");
const chartRoutes =
require("./routes/chartRoutes");
const app = express();
const newsRoutes =
require("./routes/newsRoutes");
const aiRoutes =
  require("./routes/aiRoutes");
app.use(cors());
app.use(express.json());
app.use("/stock", stockRoutes);
app.use(
    "/portfolio",
    portfolioRoutes
);
app.use("/chart", chartRoutes);
app.use("/news", newsRoutes);
app.use("/alerts", alertRoutes);
app.use("/ai", aiRoutes);
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Backend connected successfully!",
      databaseTime: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0]
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const userResult = await pool.query(
            "SELECT id, name, email, created_at FROM users WHERE id = $1",
            [req.user.id]
        );

        res.json(userResult.rows[0]);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

app.use("/watchlist", watchlistRoutes);
app.use(
    "/alerts",
    alertRoutes
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});