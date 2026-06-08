const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
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
} = require("../controllers/portfolioController");

router.post(
    "/",
    authMiddleware,
    addPortfolio
);
router.get(
    "/",
    authMiddleware,
    getPortfolio
);

router.get(
    "/summary",
    authMiddleware,
    getPortfolioSummary
);

router.get(
    "/value",
    authMiddleware,
    getPortfolioValue
);

router.get(
    "/allocation",
    authMiddleware,
    getPortfolioAllocation
);

router.get(
    "/insights",
    authMiddleware,
    getPortfolioInsights,
);

router.get(
    "/health",
    authMiddleware,
    getPortfolioHealth
);

router.get(
    "/sector-allocation",
    authMiddleware,
    getSectorAllocation
);

router.get(
    "/diversification",
    authMiddleware,
    getDiversificationScore
);
router.get(
    "/advisor",
    authMiddleware,
    getPortfolioAdvisor
);

router.post(
  "/chat",
  authMiddleware,
  aiChat
);

module.exports = router;