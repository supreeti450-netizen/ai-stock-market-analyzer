const express = require("express");
const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    createAlert,
    getAlerts,
    checkAlerts
} = require("../controllers/alertController");

router.post(
    "/",
    authMiddleware,
    createAlert
);

router.get(
    "/",
    authMiddleware,
    getAlerts
);

router.get(
    "/check",
    authMiddleware,
    checkAlerts
);

module.exports = router;