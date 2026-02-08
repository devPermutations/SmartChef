const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const llmService = require('../services/llmService');
const { truncate } = require('../middleware/validate');

const router = express.Router();

const VALID_HISTORY_ROLES = ['user', 'assistant'];
const MAX_HISTORY_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 5000;

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-MAX_HISTORY_LENGTH)
    .filter(msg =>
      msg && typeof msg === 'object' &&
      typeof msg.role === 'string' &&
      typeof msg.content === 'string' &&
      VALID_HISTORY_ROLES.includes(msg.role)
    )
    .map(msg => ({
      role: msg.role,
      content: truncate(msg.content, MAX_MESSAGE_LENGTH),
    }));
}

// POST /api/chat
router.post('/', authMiddleware, async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  const safeMessage = truncate(message.trim(), MAX_MESSAGE_LENGTH);
  if (!safeMessage) {
    return res.status(400).json({ error: 'message cannot be empty' });
  }

  const safeHistory = sanitizeHistory(history);

  try {
    const result = await llmService.chat(req.userId, safeMessage, safeHistory);
    res.json(result);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports = router;
