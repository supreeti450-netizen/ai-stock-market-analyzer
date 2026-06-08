const pool = require("../db");
const { getStockPrice } = require("../services/stockService");

const fetchStock = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await getStockPrice(symbol);

    res.json(stock);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

const getRecommendation = async (req, res) => {

    try {

        const { symbol } = req.params;

        const stock =
            await getStockPrice(symbol);

        const currentPrice =
            stock.price;
        const portfolio =
    await pool.query(
        `
        SELECT stock_symbol
        FROM portfolios
        WHERE user_id = 1
        `
    );

const holdings =
    portfolio.rows.map(
        row => row.stock_symbol
    );
        let recommendation = "HOLD";
        let confidence = 60;
        let reason =
           "Price is in neutral zone";

        if (holdings.includes(symbol)) {

            recommendation = "HOLD";
            confidence = 85;
             reason =
               "Already present in portfolio";

        }
        else if (currentPrice < 150) {

           recommendation = "BUY";
           confidence = 80;
           reason =
              "Stock appears undervalued";

        }
        else if (currentPrice > 500) {

           recommendation = "SELL";
           confidence = 75;
           reason =
             "Stock appears overextended";

        }
        

        res.json({
            symbol,
            currentPrice,
            recommendation,
            confidence,
            reason
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};
module.exports = {
    fetchStock,
    getRecommendation
};