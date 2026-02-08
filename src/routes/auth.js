const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db/database');
const crypto = require('crypto');
const { generateToken, generateOtpSessionToken, verifyOtpSessionToken, authMiddleware, setTokenCookie, clearTokenCookie } = require('../middleware/auth');
const { isValidEmail, isValidPassword, truncate, clampRadius } = require('../middleware/validate');
const audit = require('../services/auditLog');
const { sendOtpEmail } = require('../services/emailService');

const router = express.Router();

function getIp(req) {
  return req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, lowercase, and a number' });
  }

  const safeName = truncate(name.trim(), 100);
  if (!safeName) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const safeEmail = email.toLowerCase().trim();
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
  ).run(safeEmail, passwordHash, safeName);

  const token = generateToken(result.lastInsertRowid);
  setTokenCookie(res, token);
  audit.register(safeEmail, getIp(req));
  res.status(201).json({
    user: { id: result.lastInsertRowid, email: safeEmail, name: safeName }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const safeEmail = email.toLowerCase().trim();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(safeEmail);

  // Check account lockout
  if (user) {
    const lockout = db.prepare(
      "SELECT COUNT(*) as cnt FROM failed_logins WHERE user_id = ? AND attempted_at > datetime('now', '-15 minutes')"
    ).get(user.id);
    if (lockout.cnt >= 5) {
      audit.loginLocked(safeEmail, getIp(req));
      return res.status(429).json({ error: 'Account temporarily locked. Try again in 15 minutes.' });
    }
  }

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    // Record failed attempt if user exists
    if (user) {
      db.prepare('INSERT INTO failed_logins (user_id) VALUES (?)').run(user.id);
    }
    audit.loginFailed(safeEmail, getIp(req), user ? 'bad_password' : 'no_account');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Clear failed attempts on successful login
  db.prepare('DELETE FROM failed_logins WHERE user_id = ?').run(user.id);

  // Generate OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const otpSession = generateOtpSessionToken(user.id);

  // Invalidate any existing OTP for this user
  db.prepare("UPDATE otp_codes SET used = 1 WHERE user_id = ? AND used = 0").run(user.id);

  // Store OTP (expires in 5 minutes)
  db.prepare(
    "INSERT INTO otp_codes (user_id, code, expires_at) VALUES (?, ?, datetime('now', '+5 minutes'))"
  ).run(user.id, otpCode);

  audit.loginSuccess(user.email, getIp(req));
  audit.otpSent(user.email);

  // Send OTP via email (or console fallback)
  sendOtpEmail(user.email, otpCode).catch(err => {
    console.error('Failed to send OTP email:', err.message);
  });

  res.json({
    requires_otp: true,
    otp_session: otpSession,
    message: 'Verification code sent. Check your email.',
    // DEV ONLY: Remove this line before production!
    _dev_otp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
  });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { otp_session, code } = req.body;

  if (!otp_session || !code) {
    return res.status(400).json({ error: 'otp_session and code are required' });
  }

  const payload = verifyOtpSessionToken(otp_session);
  if (!payload) {
    audit.otpExpired(getIp(req));
    return res.status(401).json({ error: 'OTP session expired. Please log in again.' });
  }

  const db = getDb();
  const otp = db.prepare(
    "SELECT * FROM otp_codes WHERE user_id = ? AND used = 0 AND expires_at > datetime('now') ORDER BY created_at DESC LIMIT 1"
  ).get(payload.userId);

  if (!otp) {
    return res.status(401).json({ error: 'No valid OTP found. Please log in again.' });
  }

  // Check attempts
  if (otp.attempts >= 3) {
    db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(otp.id);
    return res.status(429).json({ error: 'Too many attempts. Please log in again.' });
  }

  // Increment attempts
  db.prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?').run(otp.id);

  if (otp.code !== code.trim()) {
    audit.otpFailed('user_' + payload.userId, 2 - otp.attempts);
    return res.status(401).json({ error: `Invalid code. ${2 - otp.attempts} attempts remaining.` });
  }

  // Mark OTP as used
  db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(otp.id);

  // Issue real token
  const user = db.prepare(
    'SELECT id, email, name, location_address, search_radius_km FROM users WHERE id = ?'
  ).get(payload.userId);

  const token = generateToken(user.id);
  setTokenCookie(res, token);
  audit.otpVerified(user.email);
  res.json({
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

  if (name !== undefined) {
    const safeName = truncate(name.trim(), 100);
    if (!safeName) return res.status(400).json({ error: 'Name cannot be empty' });
    fields.push('name = ?'); values.push(safeName);
  }
  if (location_lat !== undefined) {
    const lat = parseFloat(location_lat);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return res.status(400).json({ error: 'Invalid latitude' });
    fields.push('location_lat = ?'); values.push(lat);
  }
  if (location_lng !== undefined) {
    const lng = parseFloat(location_lng);
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) return res.status(400).json({ error: 'Invalid longitude' });
    fields.push('location_lng = ?'); values.push(lng);
  }
  if (location_address !== undefined) {
    fields.push('location_address = ?'); values.push(truncate(location_address, 500));
  }
  if (search_radius_km !== undefined) {
    fields.push('search_radius_km = ?'); values.push(clampRadius(search_radius_km));
  }

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

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true });
});

// POST /api/auth/change-password
router.post('/change-password', authMiddleware, (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  if (!isValidPassword(new_password)) {
    return res.status(400).json({ error: 'New password must be at least 8 characters with uppercase, lowercase, and a number' });
  }

  const db = getDb();
  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.userId);
  if (!user || !bcrypt.compareSync(current_password, user.password_hash)) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const newHash = bcrypt.hashSync(new_password, 12);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.userId);
  audit.passwordChanged(req.userId, getIp(req));

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = router;
