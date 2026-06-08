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
    authMiddleware,
    addToWatchlist
);

router.get(
    "/",
    authMiddleware,
    getWatchlist
);

router.delete(
    "/:symbol",
    authMiddleware,
    removeFromWatchlist
);

router.get(
    "/live",
    authMiddleware,
    getWatchlistLive
);

module.exports = router;