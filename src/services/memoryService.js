const { getDb } = require('../db/database');

// --- Preferences ---

function getPreferences(userId) {
  const db = getDb();
  return db.prepare('SELECT * FROM user_preferences WHERE user_id = ? ORDER BY preference_type, preference_value').all(userId);
}

function getPreferencesByType(userId, type) {
  const db = getDb();
  return db.prepare('SELECT * FROM user_preferences WHERE user_id = ? AND preference_type = ?').all(userId, type);
}

function addPreference(userId, type, value, source = 'user_input') {
  const db = getDb();
  // Avoid duplicates
  const existing = db.prepare(
    'SELECT id FROM user_preferences WHERE user_id = ? AND preference_type = ? AND preference_value = ?'
  ).get(userId, type, value);
  if (existing) return existing;

  const result = db.prepare(
    'INSERT INTO user_preferences (user_id, preference_type, preference_value, source) VALUES (?, ?, ?, ?)'
  ).run(userId, type, value, source);
  return { id: result.lastInsertRowid };
}

function removePreference(userId, preferenceId) {
  const db = getDb();
  return db.prepare('DELETE FROM user_preferences WHERE id = ? AND user_id = ?').run(preferenceId, userId);
}

// --- Memory ---

function getMemories(userId, category = null, limit = 20) {
  const db = getDb();
  if (category) {
    return db.prepare(
      'SELECT * FROM user_memory WHERE user_id = ? AND category = ? ORDER BY importance DESC, created_at DESC LIMIT ?'
    ).all(userId, category, limit);
  }
  return db.prepare(
    'SELECT * FROM user_memory WHERE user_id = ? ORDER BY importance DESC, created_at DESC LIMIT ?'
  ).all(userId, limit);
}

function addMemory(userId, text, category = 'context', importance = 5) {
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO user_memory (user_id, memory_text, category, importance) VALUES (?, ?, ?, ?)'
  ).run(userId, text, category, importance);
  return { id: result.lastInsertRowid };
}

function removeMemory(userId, memoryId) {
  const db = getDb();
  return db.prepare('DELETE FROM user_memory WHERE id = ? AND user_id = ?').run(memoryId, userId);
}

function buildUserContext(userId) {
  const preferences = getPreferences(userId);
  const memories = getMemories(userId, null, 30);

  const allergies = preferences.filter(p => p.preference_type === 'allergy').map(p => p.preference_value);
  const dietary = preferences.filter(p => p.preference_type === 'dietary').map(p => p.preference_value);
  const cuisinePref = preferences.filter(p => p.preference_type === 'cuisine').map(p => p.preference_value);
  const dislikes = preferences.filter(p => p.preference_type === 'dislike').map(p => p.preference_value);

  const memoryTexts = memories.map(m => m.memory_text);

  // Get recent meal history
  const db = getDb();
  const recentMeals = db.prepare(
    'SELECT recipe_id, rating, selected_at FROM meal_selections WHERE user_id = ? ORDER BY selected_at DESC LIMIT 10'
  ).all(userId);

  return {
    allergies,
    dietary,
    cuisine_preferences: cuisinePref,
    dislikes,
    memories: memoryTexts,
    recent_meals: recentMeals
  };
}

module.exports = {
  getPreferences, getPreferencesByType, addPreference, removePreference,
  getMemories, addMemory, removeMemory, buildUserContext
};
