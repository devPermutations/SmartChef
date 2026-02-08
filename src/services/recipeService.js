const fs = require('fs');
const path = require('path');

let recipeData = null;

function loadRecipes() {
  if (recipeData) return recipeData;

  const recipePath = path.join(__dirname, '..', '..', 'recipes.json');
  if (!fs.existsSync(recipePath)) {
    recipeData = { metadata: { total_recipes: 0, cuisines: [], dietary_categories: [], schema_version: '1.0' }, recipes: [] };
    return recipeData;
  }

  const raw = fs.readFileSync(recipePath, 'utf-8');
  recipeData = JSON.parse(raw);
  return recipeData;
}

function reloadRecipes() {
  recipeData = null;
  return loadRecipes();
}

function getAllRecipes() {
  return loadRecipes().recipes;
}

function getMetadata() {
  return loadRecipes().metadata;
}

function getRecipeById(id) {
  return getAllRecipes().find(r => r.id === id) || null;
}

function searchRecipes({ query, cuisine, dietary, ingredients, maxPrepTime, maxCookTime, difficulty, limit = 50, offset = 0 }) {
  let results = getAllRecipes();

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(q))
    );
  }

  if (cuisine) {
    const c = cuisine.toLowerCase();
    results = results.filter(r => r.origin.toLowerCase() === c);
  }

  if (dietary) {
    const tags = Array.isArray(dietary) ? dietary : [dietary];
    results = results.filter(r =>
      tags.every(tag => r.dietary && r.dietary.map(d => d.toLowerCase()).includes(tag.toLowerCase()))
    );
  }

  if (ingredients) {
    const ingredList = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(s => s.trim());
    results = results.filter(r =>
      ingredList.some(ing =>
        r.ingredients.some(ri => ri.name.toLowerCase().includes(ing.toLowerCase()))
      )
    );
  }

  if (maxPrepTime) {
    results = results.filter(r => r.prep_time_minutes <= parseInt(maxPrepTime));
  }

  if (maxCookTime) {
    results = results.filter(r => r.cook_time_minutes <= parseInt(maxCookTime));
  }

  if (difficulty) {
    results = results.filter(r => r.difficulty && r.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  const total = results.length;
  results = results.slice(offset, offset + limit);

  return { recipes: results, total, limit, offset };
}

module.exports = { loadRecipes, reloadRecipes, getAllRecipes, getMetadata, getRecipeById, searchRecipes };
