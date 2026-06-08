const axios = require("axios");

const getStockPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
    );

    const result = response.data.chart.result[0];

    return {
      symbol,
      price: result.meta.regularMarketPrice,
      currency: result.meta.currency,
      exchange: result.meta.exchangeName
    };

  } catch (error) {
    throw new Error("Stock not found");
  }
};

module.exports = {
  getStockPrice
};