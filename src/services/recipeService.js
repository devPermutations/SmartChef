const { getDb } = require('../db/database');

function assembleRecipe(row) {
  const db = getDb();
  const ingredients = db.prepare(
    'SELECT name, quantity, unit, category FROM recipe_ingredients WHERE recipe_id = ?'
  ).all(row.id);
  const dietary = db.prepare(
    'SELECT tag FROM recipe_dietary WHERE recipe_id = ?'
  ).all(row.id).map(d => d.tag);

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    origin: row.origin,
    dietary,
    prep_time_minutes: row.prep_time_minutes,
    cook_time_minutes: row.cook_time_minutes,
    servings: row.servings,
    difficulty: row.difficulty,
    ingredients,
    instructions: (() => { try { return JSON.parse(row.instructions || '[]'); } catch { return []; } })(),
  };
}

function getAllRecipes(limit) {
  const db = getDb();
  let rows;
  if (limit) {
    rows = db.prepare('SELECT * FROM recipes LIMIT ?').all(limit);
  } else {
    rows = db.prepare('SELECT * FROM recipes').all();
  }
  return rows.map(assembleRecipe);
}

function getMetadata() {
  const db = getDb();
  const total = db.prepare('SELECT COUNT(*) AS cnt FROM recipes').get().cnt;
  const cuisines = db.prepare('SELECT DISTINCT origin FROM recipes WHERE origin IS NOT NULL ORDER BY origin').all().map(r => r.origin);
  const dietary_categories = db.prepare('SELECT DISTINCT tag FROM recipe_dietary ORDER BY tag').all().map(r => r.tag);
  return {
    total_recipes: total,
    cuisines,
    dietary_categories,
    schema_version: '1.0',
  };
}

function getRecipeById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM recipes WHERE id = ?').get(id);
  if (!row) return null;
  return assembleRecipe(row);
}

function searchRecipes({ query, cuisine, dietary, ingredients, maxPrepTime, maxCookTime, difficulty, limit = 50, offset = 0 }) {
  const db = getDb();
  const conditions = [];
  const params = [];

  if (cuisine) {
    conditions.push('r.origin = ? COLLATE NOCASE');
    params.push(cuisine);
  }

  if (maxPrepTime) {
    conditions.push('r.prep_time_minutes <= ?');
    params.push(parseInt(maxPrepTime));
  }

  if (maxCookTime) {
    conditions.push('r.cook_time_minutes <= ?');
    params.push(parseInt(maxCookTime));
  }

  if (difficulty) {
    conditions.push('r.difficulty = ? COLLATE NOCASE');
    params.push(difficulty);
  }

  if (query) {
    const q = `%${query}%`;
    conditions.push(`(r.name LIKE ? COLLATE NOCASE OR r.description LIKE ? COLLATE NOCASE
      OR r.id IN (SELECT recipe_id FROM recipe_ingredients WHERE name LIKE ? COLLATE NOCASE))`);
    params.push(q, q, q);
  }

  if (dietary) {
    const tags = Array.isArray(dietary) ? dietary : [dietary];
    for (const tag of tags) {
      conditions.push('r.id IN (SELECT recipe_id FROM recipe_dietary WHERE tag = ? COLLATE NOCASE)');
      params.push(tag);
    }
  }

  if (ingredients) {
    const ingredList = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(s => s.trim());
    const placeholders = ingredList.map(() => 'name LIKE ? COLLATE NOCASE').join(' OR ');
    conditions.push(`r.id IN (SELECT recipe_id FROM recipe_ingredients WHERE ${placeholders})`);
    for (const ing of ingredList) {
      params.push(`%${ing}%`);
    }
  }

  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  const total = db.prepare(`SELECT COUNT(*) AS cnt FROM recipes r ${where}`).get(...params).cnt;

  const rows = db.prepare(`SELECT r.* FROM recipes r ${where} LIMIT ? OFFSET ?`).all(...params, limit, offset);

  const recipes = rows.map(assembleRecipe);

  return { recipes, total, limit, offset };
}

module.exports = { getAllRecipes, getMetadata, getRecipeById, searchRecipes };
