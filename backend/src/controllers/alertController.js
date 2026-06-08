const pool = require("../db");
const { getStockPrice } = require("../services/stockService");

const createAlert = async (req, res) => {
    try {

        const {
            stock_symbol,
            target_price,
            condition_type
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO alerts
            (
                user_id,
                stock_symbol,
                target_price,
                condition_type
            )
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                req.user.id,
                stock_symbol,
                target_price,
                condition_type
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
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
            error: err.message
        });

    }
};

const checkAlerts = async (req, res) => {
    try {

        const alerts = await pool.query(
            `
            SELECT *
            FROM alerts
            WHERE user_id = $1
            AND is_triggered = FALSE
            `,
            [req.user.id]
        );

        const triggered = [];

        for (const alert of alerts.rows) {

            const stock =
                await getStockPrice(
                    alert.stock_symbol
                );

            const currentPrice =
                stock.price;

            let hit = false;

            if (
                alert.condition_type === "ABOVE" &&
                currentPrice >= alert.target_price
            ) {
                hit = true;
            }

            if (
                alert.condition_type === "BELOW" &&
                currentPrice <= alert.target_price
            ) {
                hit = true;
            }

            if (hit) {

                await pool.query(
                    `
                    UPDATE alerts
                    SET is_triggered = TRUE
                    WHERE id = $1
                    `,
                    [alert.id]
                );

                triggered.push({
                    symbol: alert.stock_symbol,
                    currentPrice,
                    targetPrice:
                        alert.target_price,
                    condition:
                        alert.condition_type
                });
            }
        }

        res.json(triggered);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

module.exports = {
    createAlert,
    getAlerts,
    checkAlerts
};