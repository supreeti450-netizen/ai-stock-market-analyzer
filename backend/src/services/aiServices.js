const askAI = async (prompt) => {
  return `
AI Investment Recommendation

Question: ${prompt}

Suggested Stocks:

1. AAPL
   - Strong fundamentals
   - Consistent growth

2. MSFT
   - Strong AI business
   - Cloud leadership

3. NVDA
   - AI chip market leader

Risk Level: Moderate

This is a demo AI recommendation generated locally.
`;
};

module.exports = {
  askAI,
};