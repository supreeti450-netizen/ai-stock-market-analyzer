const express = require("express");
const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createAlert,
  getAlerts,
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

module.exports = router;