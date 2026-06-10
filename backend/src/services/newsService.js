const axios = require("axios");

const getNews = async (symbol) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${symbol}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
    );

    return response.data.articles;
  } catch (err) {
    throw new Error("Failed to fetch news");
  }
};

module.exports = {
  getNews,
};