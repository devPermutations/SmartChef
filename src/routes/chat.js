const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const llmService = require('../services/llmService');

const router = express.Router();

// POST /api/chat
router.post('/', authMiddleware, async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const result = await llmService.chat(req.userId, message, history || []);
    res.json(result);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;
