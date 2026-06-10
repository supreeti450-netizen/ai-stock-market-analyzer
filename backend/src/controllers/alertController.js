const pool = require("../db");

const createAlert = async (req, res) => {
  try {
    const { stock_symbol, target_price, condition_type } =
      req.body;

    const result = await pool.query(
      `
      INSERT INTO alerts
      (user_id, stock_symbol, target_price, condition_type)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        req.user.id,
        stock_symbol,
        target_price,
        condition_type,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getAlerts = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM alerts
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  createAlert,
  getAlerts,
};