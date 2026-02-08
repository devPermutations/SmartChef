const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/database');
const { generateToken, authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
  ).run(email, passwordHash, name);

  const token = generateToken(result.lastInsertRowid);
  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, email, name }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      location_address: user.location_address,
      search_radius_km: user.search_radius_km
    }
  });
});

// GET /api/auth/profile
router.get('/profile', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare(
    'SELECT id, email, name, location_lat, location_lng, location_address, search_radius_km, created_at FROM users WHERE id = ?'
  ).get(req.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const preferences = db.prepare(
    'SELECT id, preference_type, preference_value, source FROM user_preferences WHERE user_id = ?'
  ).all(req.userId);

  res.json({ ...user, preferences });
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, (req, res) => {
  const { name, location_lat, location_lng, location_address, search_radius_km } = req.body;
  const db = getDb();

  const fields = [];
  const values = [];

  if (name !== undefined) { fields.push('name = ?'); values.push(name); }
  if (location_lat !== undefined) { fields.push('location_lat = ?'); values.push(location_lat); }
  if (location_lng !== undefined) { fields.push('location_lng = ?'); values.push(location_lng); }
  if (location_address !== undefined) { fields.push('location_address = ?'); values.push(location_address); }
  if (search_radius_km !== undefined) { fields.push('search_radius_km = ?'); values.push(search_radius_km); }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(req.userId);
  db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  const user = db.prepare(
    'SELECT id, email, name, location_lat, location_lng, location_address, search_radius_km FROM users WHERE id = ?'
  ).get(req.userId);

  res.json(user);
});

module.exports = router;
