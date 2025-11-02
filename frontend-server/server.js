const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8080;

// Enable CORS for backend API
app.use(cors());

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Fallback for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend server running on http://localhost:${PORT}`);
  console.log('📁 Serving files from ConnectHub directory');
  console.log('🔗 Open http://localhost:8080/pages/homepage.html to view the app');
});
