const Sentiment = require("sentiment");
const sentiment = new Sentiment();

const { getNews } = require("../services/newsService");

const analyzeNews = async (req, res) => {
  try {
    const { symbol } = req.params;

    const articles = await getNews(symbol);

    const analyzedArticles =
      articles.map((article) => {
        const text =
          `${article.title} ${article.description || ""}`;

        const result =
          sentiment.analyze(text);

        return {
          title: article.title,
          source: article.source.name,
          url: article.url,
          sentimentScore: result.score,
          sentiment:
            result.score > 0
              ? "Positive"
              : result.score < 0
              ? "Negative"
              : "Neutral",
        };
      });

    res.json(analyzedArticles);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  analyzeNews,
};