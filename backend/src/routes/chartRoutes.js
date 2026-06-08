const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`
    );

    const result =
      response.data.chart.result[0];

    const timestamps = result.timestamp;
    const prices =
      result.indicators.quote[0].close;

    const chartData = timestamps.map(
      (time, index) => ({
        day: index + 1,
        price: prices[index]
      })
    );

    res.json(chartData);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;