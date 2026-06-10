const express = require("express");
const router = express.Router();

const {
  analyzeNews,
} = require("../controllers/newsController");

router.get("/:symbol", analyzeNews);

module.exports = router;