const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const memoryService = require('../services/memoryService');

const router = express.Router();

// GET /api/preferences
router.get('/', authMiddleware, (req, res) => {
  const prefs = memoryService.getPreferences(req.userId);
  res.json(prefs);
});

// POST /api/preferences
router.post('/', authMiddleware, (req, res) => {
  const { type, value, source } = req.body;
  if (!type || !value) {
    return res.status(400).json({ error: 'type and value are required' });
  }

  const result = memoryService.addPreference(req.userId, type, value, source || 'user_input');
  res.status(201).json(result);
});

// DELETE /api/preferences/:id
router.delete('/:id', authMiddleware, (req, res) => {
  memoryService.removePreference(req.userId, parseInt(req.params.id));
  res.json({ success: true });
});

// GET /api/preferences/memory
router.get('/memory', authMiddleware, (req, res) => {
  const category = req.query.category || null;
  const memories = memoryService.getMemories(req.userId, category);
  res.json(memories);
});

// POST /api/preferences/memory
router.post('/memory', authMiddleware, (req, res) => {
  const { text, category, importance } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  const result = memoryService.addMemory(req.userId, text, category || 'context', importance || 5);
  res.status(201).json(result);
});

// DELETE /api/preferences/memory/:id
router.delete('/memory/:id', authMiddleware, (req, res) => {
  memoryService.removeMemory(req.userId, parseInt(req.params.id));
  res.json({ success: true });
});

// GET /api/preferences/context - full user context for LLM
router.get('/context', authMiddleware, (req, res) => {
  const context = memoryService.buildUserContext(req.userId);
  res.json(context);
});

module.exports = router;
