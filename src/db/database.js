const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'smartchef.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initialize() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      location_lat REAL,
      location_lng REAL,
      location_address TEXT,
      search_radius_km REAL DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      preference_type TEXT NOT NULL,
      preference_value TEXT NOT NULL,
      source TEXT DEFAULT 'user_input',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_memory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      memory_text TEXT NOT NULL,
      category TEXT DEFAULT 'context',
      importance INTEGER DEFAULT 5,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location_lat REAL NOT NULL,
      location_lng REAL NOT NULL,
      location_address TEXT,
      data_method TEXT DEFAULT 'manual',
      data_config TEXT,
      status TEXT DEFAULT 'active',
      last_synced_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS store_deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      item_category TEXT,
      price REAL NOT NULL,
      sale_price REAL,
      unit TEXT DEFAULT 'each',
      valid_from DATETIME,
      valid_until DATETIME,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS meal_selections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      recipe_id INTEGER NOT NULL,
      selected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      rating INTEGER,
      fulfillment_type TEXT DEFAULT 'in_store',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_memory_user ON user_memory(user_id);
    CREATE INDEX IF NOT EXISTS idx_store_deals_store ON store_deals(store_id);
    CREATE INDEX IF NOT EXISTS idx_store_deals_item ON store_deals(item_name);
    CREATE INDEX IF NOT EXISTS idx_meal_selections_user ON meal_selections(user_id);
  `);

  return db;
}

module.exports = { getDb, initialize };
