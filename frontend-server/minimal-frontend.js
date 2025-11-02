console.log('🌐 Starting minimal frontend server...');

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files from parent directory
const staticPath = path.join(__dirname, '..');
app.use(express.static(staticPath));

console.log('📁 Serving files from:', staticPath);

// Handle all routes
app.get('*', (req, res) => {
  // Check if it's a file request
  if (path.extname(req.path)) {
    // Let express.static handle file requests
    return res.status(404).send('File not found');
  }
  
  // For non-file requests, serve the homepage
  res.sendFile(path.join(staticPath, 'pages', 'homepage.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('🎉 Minimal Frontend Server Started!');
  console.log(`🌐 Frontend URL: http://localhost:${PORT}`);
  console.log(`🏠 Homepage: http://localhost:${PORT}/pages/homepage.html`);
  console.log(`🧪 Auth Test: http://localhost:${PORT}/test-auth.html`);
  console.log('');
});

console.log('✅ Frontend server setup complete');
