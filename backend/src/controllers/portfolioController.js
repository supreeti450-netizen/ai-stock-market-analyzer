const pool = require("../db");
const axios = require("axios");

const stockSectorMap = {
    AAPL: "Technology",
    MSFT: "Technology",
    NVDA: "Technology",
    GOOGL: "Technology",

    TSLA: "Automotive",

    JPM: "Finance",
    BAC: "Finance",

    PFE: "Healthcare",
    JNJ: "Healthcare"
};

const addPortfolio = async (req, res) => {
    try {

        const {
            stock_symbol,
            quantity,
            buy_price
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO portfolios
            (user_id, stock_symbol, quantity, buy_price)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                req.user.id,
                stock_symbol,
                quantity,
                buy_price
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

const getPortfolio = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT *
            FROM portfolios
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

const getPortfolioSummary = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                stock_symbol,
                SUM(quantity) as total_quantity,
                AVG(buy_price) as avg_buy_price
            FROM portfolios
            WHERE user_id = $1
            GROUP BY stock_symbol
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

const getPortfolioValue = async (req, res) => {
    try {

        const portfolio = await pool.query(
            `
            SELECT *
            FROM portfolios
            WHERE user_id = $1
            `,
            [req.user.id]
        );

        let totalInvestment = 0;
        let totalCurrentValue = 0;

        const holdings = [];

        for (const stock of portfolio.rows) {

            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${stock.stock_symbol}`
            );

            const currentPrice =
                response.data.chart.result[0].meta.regularMarketPrice;

            const invested =
                stock.quantity * stock.buy_price;

            const currentValue =
                stock.quantity * currentPrice;

            totalInvestment += invested;
            totalCurrentValue += currentValue;

            holdings.push({
                symbol: stock.stock_symbol,
                quantity: stock.quantity,
                buy_price: stock.buy_price,
                current_price: currentPrice,
                invested_value: invested,
                current_value: currentValue,
                profit_loss: currentValue - invested
            });
        }

        const totalProfitLoss =
            totalCurrentValue - totalInvestment;

        const portfolioReturnPercent =
            (totalProfitLoss / totalInvestment) * 100;

        res.json({
            totalInvestment,
            totalCurrentValue,
            totalProfitLoss,
            portfolioReturnPercent,
            holdings
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

const getPortfolioAllocation = async (req, res) => {
    try {

        const portfolio = await pool.query(
            `
            SELECT *
            FROM portfolios
            WHERE user_id = $1
            `,
            [req.user.id]
        );

        let totalValue = 0;
        const allocations = [];

        for (const stock of portfolio.rows) {

            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${stock.stock_symbol}`
            );

            const currentPrice =
                response.data.chart.result[0].meta.regularMarketPrice;

            const currentValue =
                stock.quantity * currentPrice;

            totalValue += currentValue;

            allocations.push({
                symbol: stock.stock_symbol,
                currentValue
            });
        }

        const result = allocations.map(stock => ({
            symbol: stock.symbol,
            currentValue: stock.currentValue,
            allocationPercent:
                (stock.currentValue / totalValue) * 100
        }));

        res.json(result);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

const getPortfolioInsights = async (req, res) => {
    try {

        const portfolio = await pool.query(
            `
            SELECT *
            FROM portfolios
            WHERE user_id = $1
            `,
            [req.user.id]
        );

        let bestPerformer = null;
        let worstPerformer = null;

        for (const stock of portfolio.rows) {

            const response = await axios.get(
                `https://query1.finance.yahoo.com/v8/finance/chart/${stock.stock_symbol}`
            );

            const currentPrice =
                response.data.chart.result[0].meta.regularMarketPrice;

            const returnPercent =
                (
                    (currentPrice - stock.buy_price)
                    / stock.buy_price
                ) * 100;

            if (
                !bestPerformer ||
                returnPercent > bestPerformer.returnPercent
            ) {
                bestPerformer = {
                    symbol: stock.stock_symbol,
                    returnPercent
                };
            }

            if (
                !worstPerformer ||
                returnPercent < worstPerformer.returnPercent
            ) {
                worstPerformer = {
                    symbol: stock.stock_symbol,
                    returnPercent
                };
            }
        }

        res.json({
            bestPerformer,
            worstPerformer
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

const getPortfolioHealth = async (req, res) => {

    try {

        const portfolio = await pool.query(
            `
            SELECT *
            FROM portfolios
            WHERE user_id = $1
            `,
            [req.user.id]
        );

        const holdingsCount = portfolio.rows.length;

        let score = 50;

        if (holdingsCount >= 5) score += 20;

        if (holdingsCount >= 10) score += 10;

        let riskLevel = "High";

        if (holdingsCount >= 5) {
            riskLevel = "Moderate";
        }

        if (holdingsCount >= 10) {
            riskLevel = "Low";
        }

        res.json({
            healthScore: score,
            riskLevel,
            totalHoldings: holdingsCount
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

const getSectorAllocation = async (req, res) => {

    try {

        const portfolio = await pool.query(
            `
            SELECT *
            FROM portfolios
            WHERE user_id = $1
            `,
            [req.user.id]
        );

        const sectors = {};

        for (const stock of portfolio.rows) {

            const sector =
                stockSectorMap[stock.stock_symbol] ||
                "Other";

            const value =
                Number(stock.quantity) *
                Number(stock.buy_price);

            sectors[sector] =
                (sectors[sector] || 0) + value;
        }

        const total =
            Object.values(sectors)
                .reduce((a, b) => a + b, 0);

        const result = {};

        for (const sector in sectors) {

            result[sector] =
                (sectors[sector] / total) * 100;
        }

        res.json(result);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

const getDiversificationScore = async (req, res) => {

    try {

        const portfolio = await pool.query(
            `
            SELECT *
            FROM portfolios
            WHERE user_id = $1
            `,
            [req.user.id]
        );

        const sectors = {};

        for (const stock of portfolio.rows) {

            const sector =
                stockSectorMap[stock.stock_symbol] ||
                "Other";

            sectors[sector] =
                (sectors[sector] || 0) + 1;
        }

        const sectorCount =
            Object.keys(sectors).length;

        let diversificationScore =
            sectorCount * 25;

        if (diversificationScore > 100) {
            diversificationScore = 100;
        }

        let rating = "Poor";

        if (diversificationScore >= 50) {
            rating = "Average";
        }

        if (diversificationScore >= 75) {
            rating = "Good";
        }

        if (diversificationScore >= 90) {
            rating = "Excellent";
        }

        res.json({
            diversificationScore,
            rating,
            sectors
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};
const getPortfolioAdvisor = async (req, res) => {

    try {

        const portfolio = await pool.query(
            `
            SELECT *
            FROM portfolios
            WHERE user_id = $1
            `,
            [req.user.id]
        );

        const totalHoldings =
            portfolio.rows.length;

        let portfolioScore = 50;

        const strengths = [];
        const weaknesses = [];
        const recommendations = [];

        const sectors = {};

        for (const stock of portfolio.rows) {

            const sector =
                stockSectorMap[stock.stock_symbol] ||
                "Other";

            sectors[sector] =
                (sectors[sector] || 0) + 1;
        }

        const sectorCount =
            Object.keys(sectors).length;

        portfolioScore +=
            sectorCount * 10;

        if (sectorCount >= 3) {

            strengths.push(
                "Good sector diversification"
            );

        } else {

            weaknesses.push(
                "Portfolio concentrated in few sectors"
            );

            recommendations.push(
                "Add stocks from new sectors"
            );
        }

        let riskLevel = "High";

        if (sectorCount >= 2)
            riskLevel = "Moderate";

        if (sectorCount >= 4)
            riskLevel = "Low";

        const maxSectorCount =
            Math.max(
                ...Object.values(sectors)
            );

        if (
            maxSectorCount / totalHoldings > 0.7
        ) {

            weaknesses.push(
                "Overexposed to one sector"
            );

            recommendations.push(
                "Reduce concentration risk"
            );

        } else {

            strengths.push(
                "Balanced sector exposure"
            );
        }

        if (portfolioScore > 100)
            portfolioScore = 100;

        res.json({
            portfolioScore,
            riskLevel,
            strengths,
            weaknesses,
            recommendations,
            sectors
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};

const aiChat = async (req, res) => {
  try {
    const { message } = req.body;

    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("risk") ||
      lowerMessage.includes("risky")
    ) {
      return res.json({
        answer:
          "Your portfolio currently has Moderate risk. Most holdings are concentrated in the Technology sector."
      });
    }

    if (
      lowerMessage.includes("diversified") ||
      lowerMessage.includes("diversification")
    ) {
      return res.json({
        answer:
          "Your portfolio is not fully diversified. Consider adding stocks from Finance, Healthcare, or Energy sectors."
      });
    }

    if (
      lowerMessage.includes("best stock")
    ) {
      return res.json({
        answer:
          "NVDA is currently your best performing stock."
      });
    }

    if (
      lowerMessage.includes("worst stock")
    ) {
      return res.json({
        answer:
          "MSFT is currently your weakest performing stock."
      });
    }

    return res.json({
      answer:
        "I can help analyze your portfolio, risk, diversification, and stock performance."
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
    addPortfolio,
    getPortfolio,
    getPortfolioSummary,
    getPortfolioValue,
    getPortfolioAllocation,
    getPortfolioInsights,
    getPortfolioHealth,
    getSectorAllocation,
    getDiversificationScore,
    getPortfolioAdvisor,
    aiChat
};