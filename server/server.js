const express = require('express');
const cors = require('cors');
const next = require('next');
const scrapeRoutes = require('./routes/scrape');


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler(); 

const PORT = process.env.PORT || 3001;


app.prepare().then(() => {
  
    const server = express();
    
    server.use(express.json());
    server.use(cors());
  
    // Use the scraping routes
    server.use('/api/v1/scrape', scrapeRoutes);

    // Handle all other Next.js routes
    server.all('*', (req, res) => {
      return handle(req, res);
    });
  
    // Start the server
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

  });
