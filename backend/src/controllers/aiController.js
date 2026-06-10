const { askAI } = require("../services/aiServices");

const getAIResponse = async (req, res) => {
  try {
    const { question } = req.body;

    const answer = await askAI(question);

    res.json({
      answer,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getAIResponse,
};