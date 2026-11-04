/**
 * REDDY AI STUDIO - Production Video Backend Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const chatRoutes = require('./routes/chatRoutes');
const projectRoutes = require('./routes/projectRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const renderRoutes = require('./routes/renderRoutes');
const referenceRoutes = require('./routes/referenceRoutes');
const generateRoutes = require('./routes/generateRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range']
}));

// Body parsing
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static media directories
const uploadsDir = path.join(__dirname, '..', 'uploads');
const exportsDir = path.join(__dirname, '..', 'exports');
const frontendDistDir = path.join(__dirname, '..', '..', 'frontend', 'dist');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

app.use('/uploads', express.static(uploadsDir));
app.use('/exports', express.static(exportsDir));

// Serve Frontend SPA Dist if built
if (fs.existsSync(frontendDistDir)) {
  app.use(express.static(frontendDistDir));
}

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/render', renderRoutes);
app.use('/api/reference', referenceRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'REDDY AI STUDIO',
    timestamp: new Date().toISOString()
  });
});

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDistDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.send('<h1>REDDY AI STUDIO API Server</h1><p>Autonomous AI-powered video editing and rendering engine is active on port ' + PORT + '</p>');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 REDDY AI STUDIO Backend Server running on port ${PORT}`);
  console.log(`   Health Check: http://127.0.0.1:${PORT}/api/health`);
  console.log(`   Projects API: http://127.0.0.1:${PORT}/api/projects`);
  console.log(`   Render Engine: http://127.0.0.1:${PORT}/api/render/history`);
  console.log(`=======================================================`);
});

module.exports = app;
