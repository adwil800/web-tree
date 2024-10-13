const express = require('express');
const cors = require('cors');
const scrapeRoutes = require('./routes/scrape');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Use the scraping routes
app.use('/api/scrape', scrapeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
