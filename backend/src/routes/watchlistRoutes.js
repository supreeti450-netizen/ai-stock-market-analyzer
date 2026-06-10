const express = require("express");
const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist,
    getWatchlistLive
} = require("../controllers/watchlistController");

router.post(
    "/",
    addToWatchlist
);

router.get(
    "/",
    getWatchlist
);

router.delete(
    "/:symbol",
    removeFromWatchlist
);

router.get(
    "/live",
    getWatchlistLive
);

module.exports = router;