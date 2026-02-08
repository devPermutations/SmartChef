const express = require('express');
const recipeService = require('../services/recipeService');
const { authMiddleware } = require('../middleware/auth');
const { parsePositiveInt, VALID_FULFILLMENT_TYPES } = require('../middleware/validate');

const router = express.Router();

// GET /api/recipes/metadata
router.get('/metadata', (req, res) => {
  res.json(recipeService.getMetadata());
});

// GET /api/recipes/search
router.get('/search', (req, res) => {
  const { q, cuisine, dietary, ingredients, maxPrepTime, maxCookTime, difficulty, limit, offset } = req.query;

  const results = recipeService.searchRecipes({
    query: q,
    cuisine,
    dietary: dietary ? dietary.split(',') : undefined,
    ingredients,
    maxPrepTime,
    maxCookTime,
    difficulty,
    limit: limit ? parseInt(limit) : 50,
    offset: offset ? parseInt(offset) : 0
  });

  res.json(results);
});

// GET /api/recipes/history/mine - must be before /:id
router.get('/history/mine', authMiddleware, (req, res) => {
  const { getDb } = require('../db/database');
  const db = getDb();

  const selections = db.prepare(
    'SELECT * FROM meal_selections WHERE user_id = ? ORDER BY selected_at DESC LIMIT 50'
  ).all(req.userId);

  const enriched = selections.map(s => ({
    ...s,
    recipe: recipeService.getRecipeById(s.recipe_id)
  }));

  res.json(enriched);
});

// PUT /api/recipes/selections/:id/rate - must be before /:id
router.put('/selections/:id/rate', authMiddleware, (req, res) => {
  const { getDb } = require('../db/database');
  const db = getDb();

  const selectionId = parsePositiveInt(req.params.id);
  if (!selectionId) {
    return res.status(400).json({ error: 'Invalid selection ID' });
  }

  const r = parseInt(req.body.rating, 10);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
  }

  const selection = db.prepare('SELECT * FROM meal_selections WHERE id = ? AND user_id = ?').get(selectionId, req.userId);
  if (!selection) {
    return res.status(404).json({ error: 'Meal selection not found' });
  }

  db.prepare('UPDATE meal_selections SET rating = ? WHERE id = ?').run(r, selectionId);
  res.json({ ...selection, rating: r });
});

// GET /api/recipes/:id
router.get('/:id', (req, res) => {
  const id = parsePositiveInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }
  const recipe = recipeService.getRecipeById(id);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

// POST /api/recipes/:id/select - record meal selection
router.post('/:id/select', authMiddleware, (req, res) => {
  const { getDb } = require('../db/database');
  const db = getDb();
  const recipeId = parsePositiveInt(req.params.id);
  if (!recipeId) {
    return res.status(400).json({ error: 'Invalid recipe ID' });
  }

  const { fulfillment_type } = req.body;
  const safeFulfillment = VALID_FULFILLMENT_TYPES.includes(fulfillment_type) ? fulfillment_type : 'in_store';

  const recipe = recipeService.getRecipeById(recipeId);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const result = db.prepare(
    'INSERT INTO meal_selections (user_id, recipe_id, fulfillment_type) VALUES (?, ?, ?)'
  ).run(req.userId, recipeId, safeFulfillment);

  res.status(201).json({ id: result.lastInsertRowid, recipe_id: recipeId, fulfillment_type: safeFulfillment });
});

module.exports = router;
