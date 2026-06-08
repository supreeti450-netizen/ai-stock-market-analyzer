const pool = require("../db");
const { getStockPrice } = require("../services/stockService");

const addToWatchlist = async (req, res) => {
    try {

        const { stock_symbol } = req.body;

        const result = await pool.query(
            `
            INSERT INTO watchlists
            (user_id, stock_symbol)
            VALUES ($1, $2)
            RETURNING *
            `,
            [req.user.id, stock_symbol]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

const getWatchlist = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT *
            FROM watchlists
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

const removeFromWatchlist = async (req, res) => {
    try {

        const { symbol } = req.params;

        await pool.query(
            `
            DELETE FROM watchlists
            WHERE user_id = $1
            AND stock_symbol = $2
            `,
            [req.user.id, symbol]
        );

        res.json({
            message: "Removed successfully"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

const getWatchlistLive = async (req, res) => {
    try {

        const watchlist = await pool.query(
            `
            SELECT stock_symbol
            FROM watchlists
            WHERE user_id = $1
            `,
            [req.user.id]
        );

        const result = [];

        for (const stock of watchlist.rows) {

            const data =
                await getStockPrice(
                    stock.stock_symbol
                );

            result.push({
                symbol: data.symbol,
                price: data.price,
                exchange: data.exchange
            });
        }

        res.json(result);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist,
    getWatchlistLive
};