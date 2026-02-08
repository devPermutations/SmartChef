const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const storeService = require('../services/storeService');
const { getDb } = require('../db/database');

const router = express.Router();

// GET /api/stores/nearby
router.get('/nearby', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT location_lat, location_lng, search_radius_km FROM users WHERE id = ?').get(req.userId);

  if (!user || !user.location_lat || !user.location_lng) {
    return res.status(400).json({ error: 'Please set your location in your profile first' });
  }

  const radius = req.query.radius ? parseFloat(req.query.radius) : user.search_radius_km;
  const stores = storeService.findStoresNearby(user.location_lat, user.location_lng, radius);
  res.json(stores);
});

// GET /api/stores/:id
router.get('/:id', (req, res) => {
  const store = storeService.getStoreById(parseInt(req.params.id));
  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }
  res.json(store);
});

// GET /api/stores/:id/deals
router.get('/:id/deals', (req, res, next) => {
  try {
    const store = storeService.getStoreById(parseInt(req.params.id));
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const deals = storeService.getStoreDeals(parseInt(req.params.id));
    res.json({ store, deals });
  } catch (err) {
    console.error('Store deals error:', err);
    next(err);
  }
});

module.exports = router;
