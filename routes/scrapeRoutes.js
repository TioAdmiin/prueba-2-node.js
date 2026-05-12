const express = require("express");
const router = express.Router();
const { scrapeData } = require("../controllers/scrapeController");

// Endpoint original (solo lectura)
router.get("/scrape", scrapeData);

module.exports = router;

module.exports = router;