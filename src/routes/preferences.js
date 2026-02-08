const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const memoryService = require('../services/memoryService');
const { VALID_PREFERENCE_TYPES, VALID_PREFERENCE_SOURCES, truncate } = require('../middleware/validate');

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
  if (!VALID_PREFERENCE_TYPES.includes(type)) {
    return res.status(400).json({ error: `type must be one of: ${VALID_PREFERENCE_TYPES.join(', ')}` });
  }
  const safeSource = source && VALID_PREFERENCE_SOURCES.includes(source) ? source : 'user_input';
  const safeValue = truncate(value.trim(), 200);
  if (!safeValue) {
    return res.status(400).json({ error: 'value cannot be empty' });
  }

  const result = memoryService.addPreference(req.userId, type, safeValue, safeSource);
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

  const safeText = truncate(text.trim(), 1000);
  if (!safeText) {
    return res.status(400).json({ error: 'text cannot be empty' });
  }
  const safeCategory = ['context', 'preference'].includes(category) ? category : 'context';
  const safeImportance = Math.max(1, Math.min(10, parseInt(importance, 10) || 5));

  const result = memoryService.addMemory(req.userId, safeText, safeCategory, safeImportance);
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
