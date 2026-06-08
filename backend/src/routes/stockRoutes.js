const express = require("express");
const router = express.Router();

const {
  fetchStock,
  getRecommendation
} = require("../controllers/stockController");

router.get("/:symbol", fetchStock);
router.get(
    "/recommendation/:symbol",
    getRecommendation
);
module.exports = router;