console.log('🌐 Starting ConnectHub Frontend Server (No Auth)...');

const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Remove any authentication middleware
app.use((req, res, next) => {
  // Log all requests
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files from parent directory
const staticPath = path.join(__dirname, '..');
app.use(express.static(staticPath, {
  // Add cache control headers
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-cache');
  }
}));

console.log('📁 Serving files from:', staticPath);

// Specific route for homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'pages', 'homepage.html'));
});

app.get('/homepage', (req, res) => {
  res.sendFile(path.join(staticPath, 'pages', 'homepage.html'));
});

// Handle all other routes
app.get('*', (req, res) => {
  // Check if it's a specific file request
  if (path.extname(req.path)) {
    return res.status(404).send('File not found');
  }
  
  // For non-file requests, serve the homepage
  res.sendFile(path.join(staticPath, 'pages', 'homepage.html'));
});

const server = app.listen(PORT, () => {
  console.log('');
  console.log('🎉 ConnectHub Frontend Server Started!');
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🏠 Homepage: http://localhost:${PORT}/pages/homepage.html`);
  console.log(`🧪 Direct Test: http://localhost:${PORT}/direct-test.html`);
  console.log(`🔧 Auth Test: http://localhost:${PORT}/test-auth.html`);
  console.log('');
  console.log('📁 Static files served from:', staticPath);
  console.log('');
  console.log('✅ No authentication required for frontend');
  console.log('✅ CORS disabled for local development');
  console.log('');
});

// Error handling
server.on('error', (error) => {
  console.error('❌ Frontend Server Error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Frontend Server Exception:', error);
});

module.exports = app;
