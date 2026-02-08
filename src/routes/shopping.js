const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const shoppingService = require('../services/shoppingService');
const { getDb } = require('../db/database');

const router = express.Router();

// GET /api/shopping/list/:recipeId
router.get('/list/:recipeId', (req, res) => {
  const list = shoppingService.generateShoppingList(parseInt(req.params.recipeId));
  if (!list) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(list);
});

// GET /api/shopping/optimize/:recipeId
router.get('/optimize/:recipeId', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT location_lat, location_lng, search_radius_km FROM users WHERE id = ?').get(req.userId);

  if (!user || !user.location_lat || !user.location_lng) {
    return res.status(400).json({ error: 'Please set your location in your profile first' });
  }

  const mode = req.query.mode === 'convenience' ? 'convenience' : 'cost';
  const radius = req.query.radius ? parseFloat(req.query.radius) : user.search_radius_km;

  const result = shoppingService.optimizeShopping(
    parseInt(req.params.recipeId),
    user.location_lat,
    user.location_lng,
    radius,
    mode
  );

  if (!result) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  res.json(result);
});

module.exports = router;
