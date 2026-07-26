const express = require("express");
const router = express.Router();
const { getReportSummary } = require("../controllers/reportController");
const requireAuth = require("../middleware/requireAuth");

router.get("/dashboard", requireAuth, getReportSummary);

module.exports = router;
