require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initialize } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initialize();

// API Routes (before static files)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/shopping', require('./routes/shopping'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/chat', require('./routes/chat'));

// Static files (after API routes)
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback - serve index.html for non-API, non-file routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`SmartChef server running on http://localhost:${PORT}`);
});

module.exports = app;
