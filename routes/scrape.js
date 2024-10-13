const express = require('express');
const { scrapeWebsite } = require('../controllers/scrape');

const router = express.Router();

router.post('/', scrapeWebsite);

module.exports = router;
